'use strict'

const Schema = require('./schema')
const Storage = require('./storage')

function Shelf (appName, options) {
  options = options || {}

  let storage = Storage(options)

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

    return Schema(options)
  }
  return {
    extend
  }
}

module.exports = Shelf