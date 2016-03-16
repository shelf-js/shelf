'use strict'

const Lab = require('lab')
const Code = require('code')
const lab = exports.lab = Lab.script()
const Shelf = require('../index')
const Joi = require('joi')

lab.experiment('Shelf Init', () => {
  lab.test('Empty prefix', (done) => {
    let shelfInstance = Shelf(null, {
      host: '127.0.0.1',
      port: 6379
    })

    Code.expect(
      () => shelfInstance.extend()
    ).to.throw(Error, 'You need to define a valid prefix for the app')

    done()
  })

  lab.test('Invalid prefix', (done) => {
    let shelfInstance = Shelf(123, {
      host: '127.0.0.1',
      port: 6379
    })

    Code.expect(
      () => shelfInstance.extend()
    ).to.throw(Error, 'You need to define a valid prefix for the app')

    done()
  })

  lab.test('Empty name', (done) => {
    let shelfInstance = Shelf('Test', {
      host: '127.0.0.1',
      port: 6379
    })

    Code.expect(
      () => shelfInstance.extend({name: null})
    ).to.throw(Error, 'You need to define a valid name for the model')

    done()
  })

  lab.test('Invalid name', (done) => {
    let shelfInstance = Shelf('Test', {
      host: '127.0.0.1',
      port: 6379
    })

    Code.expect(
      () => shelfInstance.extend({name: 123})
    ).to.throw(Error, 'You need to define a valid name for the model')

    done()
  })

  lab.test('Invalid Props', (done) => {
    let shelfInstance = Shelf('Test', {
      host: '127.0.0.1',
      port: 6379
    })

    Code.expect(
      () => shelfInstance.extend({name: '123', props: {isJoi: false}})
    ).to.throw(Error, 'Model 123: must have props defined as a Joi Object Schema')

    done()
  })

  lab.test('Invalid Props', (done) => {
    let shelfInstance = Shelf('Test', {
      host: '127.0.0.1',
      port: 6379
    })

    Code.expect(
      () => shelfInstance.extend({name: '123', props: {isJoi: true, _type: 'array'}})
    ).to.throw(Error, 'Model 123: must have props defined as a Joi Object Schema')

    done()
  })

  lab.test('Invalid Props', (done) => {
    let shelfInstance = Shelf('Test', {
      host: '127.0.0.1',
      port: 6379
    })

    Code.expect(
      () => shelfInstance.extend({name: '123', props: Joi.object().keys({})})
    ).to.throw(Error, 'Model 123: must have at least one property defined')

    done()
  })

  lab.test('Invalid Props', (done) => {
    let shelfInstance = Shelf('Test', {
      host: '127.0.0.1',
      port: 6379
    })

    Code.expect(
      () => shelfInstance.extend({name: '123', props: Joi.object().keys({prop1: Joi.string()})})
    ).to.throw(Error, 'Model 123: must have at least one key defined')

    done()
  })

  lab.test('Invalid Props', (done) => {
    let shelfInstance = Shelf('Test', {
      host: '127.0.0.1',
      port: 6379
    })

    Code.expect(
      () => shelfInstance.extend({
        name: '123',
        props: Joi.object().keys({prop1: Joi.string()}),
        keys: ['prop1.name2']
      })
    ).to.throw(Error, 'Model 123: The model\'s keys need to be root properties')

    done()
  })

  lab.test('Invalid Props', (done) => {
    let shelfInstance = Shelf('Test', {
      host: '127.0.0.1',
      port: 6379
    })

    Code.expect(
      () => shelfInstance.extend({
        name: '123',
        props: Joi.object().keys({prop1: Joi.string()}),
        keys: ['prop2']
      })
    ).to.throw(Error, 'Model 123: The model\'s key prop2 need to be a defined property in Shelf.extend')

    done()
  })

  lab.test('Invalid methods - string', (done) => {
    let shelfInstance = Shelf('Test', {
      host: '127.0.0.1',
      port: 6379
    })

    Code.expect(
      () => shelfInstance.extend({
        name: '123',
        props: Joi.object().keys({prop1: Joi.string()}),
        keys: ['prop1'],
        methods: 'invalid'
      })
    ).to.throw(Error, 'Model 123 has invalid methods: \"value\" must be an object')

    done()
  })

  lab.test('Invalid methods - not functions', (done) => {
    let shelfInstance = Shelf('Test', {
      host: '127.0.0.1',
      port: 6379
    })

    Code.expect(
      () => shelfInstance.extend({
        name: '123',
        props: Joi.object().keys({prop1: Joi.string()}),
        keys: ['prop1'],
        methods: {
          hi: 1234
        }
      })
    ).to.throw(Error, 'Model 123 has invalid methods: \"hi\" must be a Function')

    done()
  })

  lab.test('OK', (done) => {
    let shelfInstance = Shelf('Test')

    shelfInstance.extend({
      name: '123',
      props: Joi.object().keys({prop1: Joi.string()}),
      keys: ['prop1'],
      methods: {
        hi: function () {}
      }
    })
    done()
  })
})
