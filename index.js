// Dependencies
var Model = require('./lib/model')
var callsite = require('callsite')
var util = require('./lib/util')
var Metadata = require('./lib/metadata')
var Storage = require('./lib/client')
var redis = require('redis')

// Supported types, minus object and array
// object and arrays have a special check
var supportedTypes = ['string', 'boolean', 'number', 'any']

var shelf

function Shelf (appName, options) {
  // TODO handle more options
  // options: {
  //    auth stuff,
  //    everything you can use on createClient
  // }
  options = options || {}
  var supportedOptions = {
    host: options.host || undefined,
    port: options.port || undefined
  }
  this.appName = appName
  this.storage = new Storage(supportedOptions)

  // Switch the default extend and make
  // this extend method public
  // exports.extend = this.extend.bind(this)
}

Shelf.prototype.extend = function (options) {
  options = options || {}
  options.prefix = this.appName

  // Support 'props' and 'properties' naming to define properties for a model
  options.props = options.props || options.properties
  // Same thing for model's key/keys
  options.keys = options.keys || options.key
  // Same thing for model's default values
  options.defaultValues = options.def || options.defaultValues || {}

  // Sane checks
  var nameCheck = (!options.name || typeof options.name !== 'string')
  var propertiesCheck = (!options.props || Object.keys(options.props).length <= 0)
  var keyCheck = (!options.keys || options.keys.length <= 0)

  if (nameCheck) {
    var stack = callsite()
    throw new Error('You need to define a valid name for the model in ' + stack[1].getFileName())
  }
  if (propertiesCheck) {
    throw new Error('Model ' + options.name + ': must have at least one property defined')
  }
  if (keyCheck) {
    throw new Error('Model ' + options.name + ': must have at least one key defined')
  }

  options.strict = typeof options.strict !== 'undefined' ? options.strict : true

  // check if all properties types are supported
  for (var k in options.props) {
    if (options.props.hasOwnProperty(k)) {
      var t
      options.props[k] = options.props[k].toLowerCase()
      // If its an object or an array
      if (util.isObject(options.props[k]) || util.isArray(options.props[k])) {
        t = 1
      } else {
        t = supportedTypes.indexOf(options.props[k].toLowerCase())
      }

      var type = options.props[k]
      if (typeof type !== 'string') {
        type = Object.prototype.toString.call(type)
      }

      // Check if type is supported
      if (t < 0) {
        throw new Error('Model ' + options.name + ': The type of ' + k + '  property isn\'t supported -> ' + type)
      }
    }
  }

  // Keys check
  options.keys.forEach(function (key) {
    // keys can only be root properties
    if (key.indexOf('.') > 0) {
      throw new Error('Model ' + options.name + ': The model\'s keys need to be root properties')
    }

    if (!options.props[key]) {
      throw new Error('Model ' + options.name + ': The model\'s keys need to be a defined property in Shelf.extend')
    }
  })

  options.storage = this.storage

  return new Model(options)
}

Shelf.prototype.loadMetadata = function () {
  var self = this

  var selectDatabase = function (meta) {
    self.metadata = meta

    // Select the database the app uses
    self.storage.select(meta.dbIndex, function () {
      // Set ready to true and process the offline queue
      self.storage.__client__.on_ready()
    })

    // Push everything from mountQueue to the
    // redis module internal offline_queue
    while (self.storage.mountQueue.length > 0) {
      self.storage.__client__.offline_queue.push(self.storage.mountQueue.shift())
    }

    // Fire ready event again and
    // iterate over offline_queue
    // to send all commands that were
    // queued
    self.storage.__client__.on_ready()

    self.storage.mountQueue = null
  }

  this.storage.once('ready', function () {
    // node_redis module secret flags. shhhh!
    self.storage.__client__.ready = false
    self.storage.__client__.send_anyway = false

    var connectionClient = redis.createClient()

    // Select database 0 and then get the metadata we need
    connectionClient.get(self.appName + ':metadata', function (err, metadata) {
      if (err) {
        throw err
      }

      if (!metadata) {
        metadata = new Metadata(self.storage)
        metadata.build(selectDatabase)
      }

      try {
        metadata = JSON.parse(metadata)
      } catch (e) {
        throw e
      }

      return selectDatabase(metadata)
    })
  })
}

function appRegister (appName, options) {
  shelf = new Shelf(appName, options)

  // TODO review the name of this option and
  // which state is deafult
  options.deploy = options.deploy || 'dedicated'
  if (options.deploy === 'dedicated') {
    shelf.storage.mountQueue = null
  } else {
    shelf.loadMetadata()
  }
  return shelf
}

// u mad homie?
function defaultExtend () {
  throw new Error('First you need to mount the shelf on the wall. Otherwise how would you put books on the shelf?')
}

// Public API
exports.mount = appRegister
exports.extend = defaultExtend

// Export api
module.exports = exports
