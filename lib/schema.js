'use strict'

const Joi = require('joi')
const _ = require('lodash')
const Async = require('async')
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
        let stringModel = JSON.stringify(this)
        storage.set(myKey, stringModel, cb)
      }

      // TTL in seconds
      model.saveWithTTL = function (ttl, cb) {
        let myKey = key(this)
        let stringModel = JSON.stringify(this)
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

  Model.getAll = function (filterFn, cb) {
    if (!cb) {
      cb = filterFn
      filterFn = null
    }
    let searchKey = [prefix, name].join(':').concat('*')

    scanKeys('0', [], (err, keys) => {
      if (err) {
        return cb(err)
      }
      if (!keys || keys.length === 0) {
        return cb(null, [])
      }
      keys = _.uniq(keys)
      storage.mget(keys, (err, models) => {
        if (err) {
          return cb(err)
        }
        return reduceModelsWithFilter(models, cb)
      })
    })

    function reduceModelsWithFilter (models, cb) {
      return Async.reduce(models || [], [], (newModels, model, cbAsync) => {
        model = Model(model)
        if (!filterFn || (filterFn && filterFn(model))) {
          newModels.push(model)
        }
        return cbAsync(null, newModels)
      }, cb)
    }

    function scanKeys (cursor, keys, cb) {
      storage.scan(cursor, 'MATCH', searchKey, 'COUNT', '10', (err, res) => {
        if (err) {
          return cb(err)
        }
        cursor = res[0]
        keys = keys.concat(res[1])
        if (cursor === '0') {
          return cb(null, keys)
        }
        return scanKeys(cursor, keys, cb)
      })
    }
  }

  Model.del = function (keyObj, cb) {
    let myKey = key(keyObj)
    storage.del(myKey, cb)
  }

  return Model
}

module.exports = Schema
