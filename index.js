'use strict'

const Schema = require('./lib/schema')
const Storage = require('./lib/storage')
const Joi = require('joi')

function Shelf (appName, options) {
  options = options || {}

  let storage = Storage(options)

  function extend (extendOptions) {
    options.prefix = appName
    options.storage = storage

    extendOptions = extendOptions || {}
    options.name = extendOptions.name
    options.props = extendOptions.props || extendOptions.properties
    options.keys = extendOptions.keys || extendOptions.key
    options.methods = extendOptions.methods

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
    if (options.methods) {
      let methodsSchema = Joi.object().pattern(/.*/, Joi.func()).required()
      let err = Joi.validate(options.methods, methodsSchema)
      if (err && err.error) {
        throw new Error('Model ' + options.name + ' has invalid methods: ' + err.error.details[0].message)
      }
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
    extend,
    client: storage
  }
}

module.exports = Shelf
