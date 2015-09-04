// Dependencies
var Model = require('./lib/Model')
var callsite = require('callsite')
var util = require('./lib/util')
var redis = require('redis')

// Supported types, minus object and array
// object and arrays have a special check
var supportedTypes = ['string', 'boolean', 'number', 'any']

var shelf

function Shelf (appName) {
  this.appName = appName
  this.client = redis.createClient()

  // Switch the default extend and make
  // this extend method public
  exports.extend = this.extend.bind(this)
}

Shelf.prototype.extend = function (options) {
  options = options || {}
  options.prefix = this.appName

  // Support 'props' and 'properties' naming to define properties for a model
  options.props = options.props || options.properties
  // Same thing for model's key/keys
  options.keys = options.keys || options.key

  // Sane checks
  var nameCheck = (!options.name || typeof options.name !== 'string')
  var propertiesCheck = (!options.props || options.props.length <= 0)
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

      // If its an object or an array
      if (util.isObject(options.props[k]) || util.isArray(options.props[k])) {
        t = 1
      } else {
        t = supportedTypes.indexOf(options.props[k])
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

  options.storage = this.client

  return new Model(options)
}

Shelf.prototype.loadMetadata = function () {
  this.client.select(0, function () {
    console.log('arguments');
  })
}

function appRegister (appName) {
  shelf = new Shelf(appName)
  shelf.loadMetadata()
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
