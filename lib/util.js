'use strict'

const _ = require('lodash')

function Util () {
  function keyFn (prefix, name, keys) {
    if (!prefix || typeof prefix !== 'string') {
      throw new Error('Prefix must be a string')
    }
    if (!name || typeof name !== 'string') {
      throw new Error('Name must be a string')
    }
    if (!keys || !_.isArray(keys)) {
      throw new Error('Keys must be an array')
    }
    if (keys.length === 0) {
      throw new Error('Keys must have values')
    }
    return function (obj) {
      if (!obj || !_.isObject(obj)) {
        throw new Error('Invalid object to extract key')
      }

      let finalKey = prefix + ':' + name + ':'
      keys.forEach((key) => {
        if (obj[key]) {
          finalKey += obj[key] + ':'
        } else {
          throw new Error('Missing the key ' + key + ' from the keys object')
        }
      })

      return finalKey.slice(0, -1)
    }
  }
  return {
    keyFn
  }
}

module.exports = Util()
