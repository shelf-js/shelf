var shelf = require('../index')

var shelfStorage = (function () {
  var myShelf = null

  var init = function () {
    myShelf = shelf.mount('test', {
      host: '127.0.0.1',
      port: 6379
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
})()

module.exports = shelfStorage
