const Shelf = require('./storage3')
const Joi = require('joi')

const MySchema = Shelf.extend({
  name: 'MySchema3',
  props: Joi.object().keys({
    prop1: Joi.string(),
    prop2: Joi.string()
  }),
  keys: ['prop1']
})

module.exports = MySchema
