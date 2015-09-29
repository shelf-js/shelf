// Dependecies
var util = require('./util')

module.exports = function (options) {
  // generate a constructor
  var Model = util.generator.constructor(options)

  // generate a key function
  Model.key = util.generator.keyFn(options.prefix, options.name, options.keys)

  // Save the newly created Channel object
  Model.prototype.save = function (callback) {
    var key = Model.key(this)

    try {
      var proto = new Model(this, this.__settings__) // eslint-disable-line no-unused-vars
    } catch (e) {
      return callback(e)
    }

    Model.storage.set(key, JSON.stringify(this), callback)
  }

  Model.prototype.saveWithTTL = function (ttl, callback) {
    var self = this
    this.save(function (err) {
      if (err) {
        return callback(err)
      }

      // Generate the key of this instance
      var key = Model.key(self)

      return Model.storage.expire(key, ttl, callback)
    })
  }

  // Storage instance
  Model.storage = options.storage

  // Get one specific object
  Model.get = function (keyObj, callback) {
    var key = Model.key(keyObj)
    Model.storage.get(key, function (err, propsJson) {
      if (err) {
        return callback(new Error('Error loading channel: ' + err))
      }
      // If empty return empty callback
      if (!propsJson) {
        return callback()
      }

      var properties = JSON.parse(propsJson)

      // Force strict and enforce to false
      var channel = new Model(properties, {strict: false, enforce: false})

      return callback(null, channel)
    })
  }

  // Get multiple objects
  Model.mget = function (keyObj, cb) {
    var key = Model.key(keyObj)
    Model.storage.keys(key, function (err, keys) {
      if (err || keys.length < 1) {
        return cb(err, [])
      }

      Model.storage.mget(keys, function (err, subscriptions) {
        if (err) {
          return cb(err)
        }

        for (var s in subscriptions) {
          if (subscriptions.hasOwnProperty(s)) {
            // Force strict and enforce to false
            subscriptions[s] = new Model(JSON.parse(subscriptions[s]), {strict: false, enforce: false})
          }
        }

        return cb(null, subscriptions)
      })
    })
  }

  // Delete channel from Redis
  Model.del = function (keyObj, callback) {
    var key = Model.key(keyObj)
    Model.storage.del(key, callback)
  }

  // Delete channel from Redis (prototype version)
  Model.prototype.del = function (callback) {
    var key = Model.key(this)
    Model.storage.del(key, callback)
  }

  return Model
}
