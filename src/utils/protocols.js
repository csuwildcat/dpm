
function addSchemas(config) {
  const types = config.types;
  const protocolUri = config.protocol;
  return Object.entries(types).reduce((result, [key, value]) => {
    if (value.dataFormats.some(format => format.match('json'))) {
      result[key] = types[key].schema = protocolUri + '/schemas/' + key;
    }
    return result;
  }, {})
}


const drpmDefinition = {
  protocol  : 'https://dpm.software/docs/protocol',
  published : true,
  types     : {
    publisher : {
      dataFormats : ['application/json'],
    },
    package : {
      dataFormats : ['application/json'],
    },
    logo : {
      dataFormats : ['image/gif', 'image/png', 'image/jpeg']
    },
    release : {
      schema      : 'https://www.rfc-editor.org/rfc/rfc1952.html',
      dataFormats : ['application/gzip'],
    },
    admin : {
      dataFormats : ['application/json']
    }
  },
  structure : {
    publisher: {
      $role: true,
    },
    package : {
      $tags : {
        name : {
          type : 'string',
        },
        $requiredTags : ['name'],
      },
      $actions : [
        {
          who : 'author',
          of: 'package',
          can : ['create', 'update', 'delete'],
        },
        {
          role : 'publisher',
          can : ['create', 'update', 'delete'],
        },
        {
          role : 'package/admin',
          can : ['co-update', 'co-delete']
        }
      ],
      admin: {
        $role: true,
        $actions : [
          {
            who : 'author',
            of: 'package',
            can : ['create', 'update', 'delete'],
          }
        ]
      },
      logo: {
        $actions : [
          {
            who : 'author',
            of: 'package',
            can : ['create', 'update', 'delete', 'co-update', 'co-delete']
          },
          {
            role : 'package/admin',
            can : ['create', 'update', 'delete', 'co-update', 'co-delete']
          }
        ]
      },
      release: {
        $tags : {
          name : {
            type : 'string',
          },
          version : {
            type : 'string',
          },
          integrity : {
            type : 'string',
          },
          $requiredTags : ['name', 'version', 'integrity']
        },
        $actions : [
          {
            who : 'author',
            of: 'package',
            can : ['create', 'update', 'delete']
          },
          {
            role : 'package/admin',
            can : ['create', 'update', 'delete']
          }
        ]
      }
    }
  }
}

const profileDefinition = {
  published: true,
  protocol: "https://areweweb5yet.com/protocols/profile",
  types: {
    name: {
      dataFormats: ['application/json']
    },
    social: {
      dataFormats: ['application/json']
    },
    messaging: {
      dataFormats: ['application/json']
    },
    phone: {
      dataFormats: ['application/json']
    },
    address: {
      dataFormats: ['application/json']
    },
    career: {
      dataFormats: ['application/json']
    },
    payment: {
      dataFormats: ['application/json']
    },
    connect: {
      dataFormats: ['application/json']
    },
    avatar: {
      dataFormats: ['image/gif', 'image/png', 'image/jpeg']
    },
    hero: {
      dataFormats: ['image/gif', 'image/png', 'image/jpeg']
    }
  },
  structure: {
    name: {},
    social: {},
    career: {},
    avatar: {},
    hero: {},
    messaging: {},
    address: {},
    phone: {},
    payment: {},
    connect: {}
  }
}



export const profile = {
  uri: profileDefinition.protocol,
  schemas: addSchemas(profileDefinition),
  definition: profileDefinition
}

export const drpm = {
  uri: drpmDefinition.protocol,
  schemas: addSchemas(drpmDefinition),
  definition: drpmDefinition
}

export const byUri = {
  [profileDefinition.protocol]: profile,
  [drpmDefinition.protocol]: drpm,
}

export const byAlias = {
  profile, drpm
}