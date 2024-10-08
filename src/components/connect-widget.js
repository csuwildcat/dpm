import { LitElement, css, html } from 'lit'

import { App } from '../app.js';

import './shoelace';
import PageStyles from '../styles/page.js';
import * as protocols from '../utils/protocols.js';

import { DWeb } from '../utils/dweb'; 
import { State, Query, Spinner, SpinnerStyles } from '../components/mixins';

export class ConnectWidget extends LitElement.with(State, Query, Spinner) {

  static properties = {
    identities: { store: 'page' }
  }

  constructor() {
    super()
  }

  firstUpdated() {
    
  }

  render() {
    return this.connected ? html`
      <div>connected</div>
    ` :
    html`
      <section flex="column center-x center-y">
        <sl-button variant="default" size="large" @click="${ async e => {
          e.target.loading = true;
          const identity = await DWeb.identity.create({
            //dwnEndpoints: ['http://localhost:3000']
          });
          App.addIdentity(identity);
          e.target.loading = false;
          router.navigateTo(`/directory/${identity.did.uri}`);
        }}">
          <sl-icon slot="prefix" name="person-plus"></sl-icon>
          Create a new identity
        </sl-button>
        <div break-text="OR"></div>
        <sl-button variant="default" size="large" @click="${ e => {} }">
          <sl-icon slot="prefix" name="wallet2"></sl-icon>
          Connect via Wallet
        </sl-button>
        <sl-button variant="default" size="large" @click="${ e => App.restoreIdentityModal.show() }">
          <sl-icon slot="prefix" name="upload"></sl-icon>
          Restore from File
        </sl-button>
        <!-- <sl-button variant="default" size="large" @click="${ e => {} }">
          <sl-icon slot="prefix" name="key-fill"></sl-icon>
          Enter as Password
        </sl-button> -->
      </section>
    `
  }


  static styles = [
    PageStyles,
    SpinnerStyles,
    css`
      :host {
        display: flex;
        justify-content: center;
      }

      sl-button {
        width: 100%;
      }

      sl-button + sl-button {
        margin: 1rem 0 0;
      }

      @media(max-width: 800px) {

      }
    `
  ]
}

customElements.define('connect-widget', ConnectWidget)
