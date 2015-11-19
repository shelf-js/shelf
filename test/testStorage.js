var shelf = require('../index')

var shelfStorage = (function () {
  var myShelf = null

  var init = function () {
    myShelf = shelf.mount('test', {
      host: 'localhost',
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
