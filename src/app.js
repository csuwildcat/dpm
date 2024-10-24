
import { DWeb } from './utils/dweb';
import { State } from './components/mixins/index.js';
import { Datastore } from './utils/datastore.js';
import * as protocols from './utils/protocols';

async function initializeIdentities(list){
  const identities = {};
  const startupTasks = [];
  list = !list ? await DWeb.identity.list() : Array.isArray(list) ? list : [list];
  await Promise.all(list.map(async identity => {
    identities[identity.did.uri] = identity;
    if (identity.web5) return;
    const web5 = identity.web5 = await DWeb.use(identity);
    const datastore = identity.datastore = new Datastore(web5);
    const configurationPromises = [];
    for (let alias in protocols.byAlias) {
      configurationPromises.push(web5.installProtocol(protocols.byAlias[alias].definition).then(() => {
        web5.aliasProtocol(alias, protocols.byAlias[alias].definition)
    }));
    }
    await Promise.all(configurationPromises);
    startupTasks.push(datastore.readRecordPath('profile', 'connect').then(async record => {
      if (record) {
        const data = record.cache.json || {};
        const wallets = data?.webWallets || (data.webWallets = []);
        if (!wallets.find(url => new URL(url).origin === location.origin)) {
          wallets.push(location.origin);
          await record.update({ data, published: true });
          if (navigator.onLine) await record.send();
        }
      }
      else {
        record = await datastore.putRecordPath('profile', 'connect', { webWallets: [location.origin] }, { published: true });
      }
      identity.connectRecord = record;
    }).catch(e => console.error(e)));
  }));
  Promise.allSettled(startupTasks).then(() => App.updateState('identities')).catch(e => console.error(e));
  return identities;
}

async function initializePackages(){
  await App.ready;
  return this.packages || new Promise(async resolve => {
    const promises = [];
    const packages = [];
    for (let identity in this.identities) {
      const datastore = this.identities[identity].datastore;
      promises.push(datastore.queryPackages().then(async ({ records }) => {
        packages.concat(records);
      }));
    }
    await Promise.all(promises);
    resolve(this.packages = packages);
  });
}

let App;
const $App = (superClass) => class extends superClass.with(State) {

  static properties = {
    ready: { store: 'page' },
    identities: { store: 'page' },
    packages: { store: 'page' },
    avatars: { store: 'page' }
  }

  constructor(){
    super();

    if (App) throw '$App is a singleton and an instance already exists.';
    else globalThis.App = App = this;

    let ready;
    this.ready = new Promise(resolve => ready = resolve);
    initializeIdentities().then(identities => {
      this.identities = identities;
      this.ready.state = true;
      ready(true);
    });
  }

  async updateState(prop, value, merge) {
    const currentValue = this[prop];
    value = value === undefined ? currentValue : value;
    if (Array.isArray(value)) {
      this[prop] = merge && value !== currentValue ? [ ...(currentValue || []), ...(value || [])] : { ...value };
    }
    else if (typeof value === 'object' && value) {
      this[prop] = merge && value !== currentValue ? { ...(currentValue || {}), ...(value || {}) } : { ...value };
    }
    else {
      this[prop] = value;
    }
    return this[prop];
  }

  async updateProfileImage(identity, type, file){
    const record = await identity.datastore.putRecordPath('profile', type, file, { published: true });
    identity[type] = record.drl + '?cache-updated=' + new Date().getTime();
    this.updateState('identities');
    return record;
  }

  async addIdentity(identity){
    await initializeIdentities(identity);
    return this.identities = { ...(this.identities || {}), [DWeb.identity.uriFrom(identity)]: identity }; 
  }

  async addPackage(pkg){
    await initializePackages();
    return this.packages = [...this.packages, pkg]; 
  }

  async saveIdentityLabel(identity, label){
    const record = identity.connectRecord;
    if (!record) {
      console.log('No connect record found for identity: ', identity);
      return;
    }
    const data = record.cache.json;
    data.label = label;
    await record.update({ data, published: true });
    if (navigator.onLine) await record.send();
    await DWeb.identity.addAutofillDid(label + '@' + identity.did.uri);
    this.updateState('identities');
  }

}

export { $App, App };