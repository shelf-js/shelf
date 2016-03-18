'use strict'

const Joi = require('joi')
const util = require('./util')

function Schema (options) {
  let optionsClone = Object.assign({}, options)

  let storage = optionsClone.storage
  let prefix = optionsClone.prefix
  let name = optionsClone.name
  let keys = optionsClone.keys
  let methods = optionsClone.methods
  let props = optionsClone.props

  let key = util.keyFn(prefix, name, keys)

  let Model = function (properties) {
    return Joi.validate(properties, props, (err, model) => {
      if (err) {
        throw err
      }

      keys.forEach((key) => {
        if (model[key] === undefined) {
          throw new Error('Model missing key: ' + key)
        }
      })

      model.save = function (cb) {
        let myKey = key(this)
        let stringModel = JSON.stringify(model)
        storage.set(myKey, stringModel, cb)
      }

      // TTL in seconds
      model.saveWithTTL = function (ttl, cb) {
        let myKey = key(this)
        let stringModel = JSON.stringify(model)
        storage.setex(myKey, ttl, stringModel, cb)
      }

      model.del = function (cb) {
        let myKey = key(this)
        storage.del(myKey, cb)
      }

      if (methods) {
        let methodsNames = Object.keys(methods)
        methodsNames.forEach((methodName) => {
          model[methodName] = methods[methodName]
        })
      }

      return model
    })
  }

  Model.get = function (keyObj, cb) {
    let myKey = key(keyObj)
    storage.get(myKey, (err, propsJson) => {
      if (err) {
        return cb(new Error('Error loading model: ' + err.message))
      }
      if (!propsJson) {
        return cb(null, null)
      }

      let properties = JSON.parse(propsJson)

      return cb(null, Model(properties))
    })
  }

  Model.del = function (keyObj, cb) {
    let myKey = key(keyObj)
    storage.del(myKey, cb)
  }

  return Model
}

module.exports = Schema
