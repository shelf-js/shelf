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

    try {
      shelfInstance.extend()
    } catch (err) {
      Code.expect(err).to.not.be.null()
      Code.expect(err.message).to.equal('You need to define a valid prefix for the app')
      done()
    }
  })

  lab.test('Invalid prefix', (done) => {
    let shelfInstance = Shelf(123, {
      host: '127.0.0.1',
      port: 6379
    })

    try {
      shelfInstance.extend()
    } catch (err) {
      Code.expect(err).to.not.be.null()
      Code.expect(err.message).to.equal('You need to define a valid prefix for the app')
      done()
    }
  })

  lab.test('Empty name', (done) => {
    let shelfInstance = Shelf('Test', {
      host: '127.0.0.1',
      port: 6379
    })

    try {
      shelfInstance.extend({name: null})
    } catch (err) {
      Code.expect(err).to.not.be.null()
      Code.expect(err.message).to.equal('You need to define a valid name for the model')
      done()
    }
  })

  lab.test('Invalid name', (done) => {
    let shelfInstance = Shelf('Test', {
      host: '127.0.0.1',
      port: 6379
    })

    try {
      shelfInstance.extend({name: 123})
    } catch (err) {
      Code.expect(err).to.not.be.null()
      Code.expect(err.message).to.equal('You need to define a valid name for the model')
      done()
    }
  })

  lab.test('Invalid Props', (done) => {
    let shelfInstance = Shelf('Test', {
      host: '127.0.0.1',
      port: 6379
    })

    try {
      shelfInstance.extend({name: '123', props: {isJoi: false}})
    } catch (err) {
      Code.expect(err).to.not.be.null()
      Code.expect(err.message).to.equal('Model 123: must have props defined as a Joi Object Schema')
      done()
    }
  })

  lab.test('Invalid Props', (done) => {
    let shelfInstance = Shelf('Test', {
      host: '127.0.0.1',
      port: 6379
    })

    try {
      shelfInstance.extend({name: '123', props: {isJoi: true, _type: 'array'}})
    } catch (err) {
      Code.expect(err).to.not.be.null()
      Code.expect(err.message).to.equal('Model 123: must have props defined as a Joi Object Schema')
      done()
    }
  })

  lab.test('Invalid Props', (done) => {
    let shelfInstance = Shelf('Test', {
      host: '127.0.0.1',
      port: 6379
    })

    try {
      shelfInstance.extend({name: '123', props: Joi.object().keys({})})
    } catch (err) {
      Code.expect(err).to.not.be.null()
      Code.expect(err.message).to.equal('Model 123: must have at least one property defined')
      done()
    }
  })

  lab.test('Invalid Props', (done) => {
    let shelfInstance = Shelf('Test', {
      host: '127.0.0.1',
      port: 6379
    })

    try {
      shelfInstance.extend({name: '123', props: Joi.object().keys({prop1: Joi.string()})})
    } catch (err) {
      Code.expect(err).to.not.be.null()
      Code.expect(err.message).to.equal('Model 123: must have at least one key defined')
      done()
    }
  })

  lab.test('Invalid Props', (done) => {
    let shelfInstance = Shelf('Test', {
      host: '127.0.0.1',
      port: 6379
    })

    try {
      shelfInstance.extend({
        name: '123',
        props: Joi.object().keys({prop1: Joi.string()}),
        keys: ['prop1.name2']
      })
    } catch (err) {
      Code.expect(err).to.not.be.null()
      Code.expect(err.message).to.equal('Model 123: The model\'s keys need to be root properties')
      done()
    }
  })

  lab.test('Invalid Props', (done) => {
    let shelfInstance = Shelf('Test', {
      host: '127.0.0.1',
      port: 6379
    })

    try {
      shelfInstance.extend({
        name: '123',
        props: Joi.object().keys({prop1: Joi.string()}),
        keys: ['prop2']
      })
    } catch (err) {
      Code.expect(err).to.not.be.null()
      Code.expect(err.message).to.equal('Model 123: The model\'s key prop2 need to be a defined property in Shelf.extend')
      done()
    }
  })

  lab.test('OK', (done) => {
    let shelfInstance = Shelf('Test')

    shelfInstance.extend({
      name: '123',
      props: Joi.object().keys({prop1: Joi.string()}),
      keys: ['prop1']
    })
    done()
  })
})
