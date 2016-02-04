'use strict'

const Model = require('./lib/model')
const redis = require('redis')

function Shelf (appName, options) {
  // TODO handle more options
  // options: {
  //    auth stuff,
  //    everything you can use on createClient
  // }

  options = options || {}

  let storage = redis.createClient(
    options.port || 6379,
    options.host || '127.0.0.1',
    options)

  function extend (options) {
    options = options || {}
    options.prefix = appName
    options.storage = storage

    options.props = options.props || options.properties
    options.keys = options.keys || options.key

    if (!options.prefix || typeof options.prefix !== 'string') {
      throw new Error('You need to define a valid prefix for the app')
    }
    if (!options.name || typeof options.name !== 'string') {
      throw new Error('You need to define a valid name for the model')
    }
    if (!options.props.isJoi || options.props._type !== 'object') {
      throw new Error('Model ' + options.name + ': must have props defined as a Joi Object Schema')
    }
    if (options.props._inner.children.length === 0) {
      throw new Error('Model ' + options.name + ': must have at least one property defined')
    }
    if (!options.keys || options.keys.length <= 0) {
      throw new Error('Model ' + options.name + ': must have at least one key defined')
    }

    options.keys.forEach((key) => {
      if (key.indexOf('.') > 0) {
        throw new Error('Model ' + options.name + ': The model\'s keys need to be root properties')
      }

      if (!options.props._inner.children.find((child) => child.key === key)) {
        throw new Error('Model ' + options.name + ': The model\'s key ' + key + ' need to be a defined property in Shelf.extend')
      }
    })

    return Model(options)
  }
  return {
    extend
  }
}

module.exports = Shelf
