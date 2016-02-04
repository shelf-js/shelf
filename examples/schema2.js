const Shelf = require('./storage2')
const Joi = require('joi')

const MySchema2 = Shelf.extend({
  name: 'MySchema2',
  props: Joi.object().keys({
    prop1: Joi.string(),
    prop2: Joi.string()
  }),
  keys: ['prop1']
})

module.exports = MySchema2
