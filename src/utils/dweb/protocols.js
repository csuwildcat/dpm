import {
  canonicalize
} from './helpers';

const methods = {
  async $set (options = {}) {
    const { web5, definition } = this._config;
    const { records } = await queryRecords(web5, definition, this._path, Object.assign(options, {
      latest: true
    }));
    record = records[0];
    const data = options.data instanceof File ? new Blob([options.data], { type: options.dataFormat || options.data.type }) : options.data;
    try {
      if (record) {
        await record.update({ data, published: options.published });
        if (options.send !== false) {
          await record.send(options.target || web5.connectedDid);
        }
      }
      else {
        const dataFormat = data instanceof Blob ? data.type : options.dataFormat;
        const createResponse = await createRecord(web5, definition, this._path, { data, dataFormat, published: options.published });
        record = createResponse.record;
      }
    }
    catch(e) {
      console.log(e);
    }
    return record;
  },
  async $get(options = {}) {
    const { web5, definition } = this._config;
    const { records } = await queryRecords(web5, definition, this._path, Object.assign(options, {
      latest: true
    }));
    return records[0]
  },
  async $create(options = {}) {
    const { web5, definition } = this._config;
    return createRecord(web5, definition, this._path, options);
  },
  async $query(options = {}) {
    const { web5, definition } = this._config;
    return queryRecords(web5, definition, this._path, options);
  }
}

const apiProps = ['from', 'store', 'data'];
const messageProps = ['recipient', 'role', 'contextId', 'parentContextId', 'published'];

async function createRecord(web5, definition, path, options = {}){

  const type = definition.types?.[path.split('/').pop()];
  const message = {
    protocol: definition.protocol,
    protocolPath: path
  };
  const params = { message }

  if (options.target) params.from = options.target;

  if (type) {
    if (type?.schema) message.schema = type.schema;
    if (options.dataFormat) {
      message.dataFormat = options.dataFormat;
    }
    else if (type?.dataFormats?.length === 1 && type?.dataFormats[0]?.match(/application\/json|text\/json/)) {
      message.dataFormat = type.dataFormats[0];
    }
  }

  apiProps.forEach(prop => options[prop] !== 'undefined' && (params[prop] = options[prop]));
  messageProps.forEach(prop => options[prop] !== 'undefined' && (message[prop] = options[prop]));
  
  const response = await web5.dwn.records.create(params);

  console.log('create response: ', response);

  if (options.send !== false) {
    await response.record.send(options.target || web5.connectedDid).then(e => {
      console.log('sent success: ', response);
    }).catch(e => {
      console.log('send error: ', e)
    });
  }
  return response;
}

async function queryRecords(web5, definition, path, options = {}){

  const message = {
    filter: Object.assign(options.filter || {}, {
      protocol: definition.protocol,
      protocolPath: path
    })
  };
  const params = { message }

  if (options.target) params.from = options.target;

  if (options.role) {
    message.protocolRole = options.role
  }

  if (options.sort || options.latest) {
    message.dateSort = options.latest ? 'createdDescending' : options.sort;
  }

  if (options.pagination || options.latest) {
    message.pagination = options.latest ? { limit: 1 } : options.pagination;
  }

  return web5.dwn.records.query(params);
}

function walkObject(obj, callback, path = '') {
  if (typeof obj !== 'object' || Array.isArray(obj) || obj === null) {
    return obj; // Base case: return primitive values directly
  }
  const result = {}; // Create a new object to hold the result
  for (const key in obj) {
    if (!key.startsWith('$')) {
      result[key] = walkObject(obj[key], callback, path ? `${path}/${key}` : key);
    }
  }
  return callback(path, result) || result;
}

export function modifyProtocolsObject(web5){

  if (web5.installedProtocols) return;

  web5.installedProtocols = [];
  const protocolsLoaded = web5.dwn.protocols.query({ message: {} }).then(result => web5.installedProtocols = result.protocols);

  web5.protocols = web5.protocols || {};

  web5.installProtocol = async function installProtocol(definition) {
    try {
      await protocolsLoaded;
      let record = web5.installedProtocols.find(record => definition.protocol === record.definition.protocol);
      let newDef = canonicalize(definition);
      let currentDef = canonicalize(record?.definition || null);
      if (newDef !== currentDef) {
        console.log('installing protocol: ' + definition.protocol);
        return web5.dwn.protocols.configure({
          message: { definition }
        }).then(protocol => {
          web5.installedProtocols.push(protocol);
          return protocol.send(web5.connectedDid);
        })
      }
    }
    catch(e){
      console.log(e);
    }
  }

  web5.aliasProtocol = async function aliasProtocol (name, protocol) {
    await protocolsLoaded;
    if (typeof protocol === 'string') {
      const record = web5.installedProtocols.find(record => record.definition.protocol == protocol);
      if (!record) {
        throw 'Protocol is not installed';
      }
      protocol = record.definition;
    }
    const config = { web5, definition: protocol };
    web5.protocols[name] = walkObject(protocol.structure, (path, obj) => {
      if (path) {
        obj._config = config;
        obj._path = path;
        return { ...obj, ...methods };
      }
    })
    protocol.structure._config = config;
  }

}