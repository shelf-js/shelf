const Shelf = require('../index')

const ShelfStorage = function () {
  let myShelf = null

  function init () {
    myShelf = Shelf('MyStorage', {
      host: '127.0.0.1', // also the default
      port: 6379 // also the default
    })
    return myShelf
  }

  return {
    getInstance: function () {
      if (!myShelf) {
        myShelf = init()
      }
      return myShelf
    }
  }
}

module.exports = ShelfStorage()
