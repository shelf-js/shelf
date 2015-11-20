var shelfStorage = require('./testStorage').getInstance()

var test = (function () {
  return shelfStorage.extend({
    name: 'test',
    props: {
      prop1: 'string',
      prop2: 'string'
    },
    defaultValues: {
      prop2: 'World'
    },
    keys: ['prop1']
  })
})()

module.exports = test
