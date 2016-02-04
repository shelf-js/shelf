const Shelf = require('./storage')
const Joi = require('joi')

const MySchema = Shelf.extend({
  name: 'MySchema',
  props: Joi.object().keys({
    prop1: Joi.string(),
    prop2: Joi.string()
  }),
  keys: ['prop1']
})

module.exports = MySchema
