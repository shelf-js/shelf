const Shelf = require('../index')

module.exports = Shelf('MyStorage', {
  host: '127.0.0.1', // also the default
  port: 6379 // also the default
})
