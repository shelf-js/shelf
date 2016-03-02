'use strict'

const redis = require('redis')

let storages = []

const Storage = function (options) {
  // let options
  let storage = null

  function init (options) {
    storage = redis.createClient(
      options.port || 6379,
      options.host || '127.0.0.1',
      options)
    // keep track of storages
    storages.push(storage)
  }

  // make sure we re use connections
  let myStore = storages.find((storage) =>
    storage.connection_options.port === options.port &&
    storage.connection_options.host === options.host
  )
  if (myStore) {
    storage = myStore
  } else {
    init(options)
  }

  return storage
}

module.exports = Storage
