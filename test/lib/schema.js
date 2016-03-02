'use strict'

const Lab = require('lab')
const Code = require('code')
const lab = exports.lab = Lab.script()
const Shelf = require('../../index')
const Joi = require('joi')
const proxyquire = require('proxyquire')

const Storage = Shelf('testApp', {
  host: '127.0.0.1',
  port: 6379
})

lab.experiment('Model', () => {
  lab.test('Missing key', (done) => {
    let MyModel = Storage.extend({
      name: 'myModel',
      props: Joi.object().keys({
        prop1: Joi.string(),
        prop2: Joi.string()
      }),
      keys: ['prop1']
    })

    Code.expect(
      () => MyModel({prop2: 'cenas'})
    ).to.throw(Error, 'Model missing key: prop1')

    done()
  })

  lab.test('Invalid model', (done) => {
    let MyModel = Storage.extend({
      name: 'myModel',
      props: Joi.object().keys({
        prop1: Joi.string(),
        prop2: Joi.string()
      }),
      keys: ['prop1']
    })

    Code.expect(
      () => MyModel({prop1: 1})
    ).to.throw(Error, 'child "prop1" fails because ["prop1" must be a string]')

    done()
  })
  lab.test('Save model', (done) => {
    let MyModel = Storage.extend({
      name: 'myModel',
      props: Joi.object().keys({
        prop1: Joi.string(),
        prop2: Joi.string()
      }),
      keys: ['prop1']
    })
    let model = MyModel({prop1: 'value'})

    model.save((err, message) => {
      Code.expect(err).to.be.null()
      Code.expect(message).to.equal('OK')
      done()
    })
  })
  lab.test('Get saved model', (done) => {
    let MyModel = Storage.extend({
      name: 'myModel',
      props: Joi.object().keys({
        prop1: Joi.string(),
        prop2: Joi.string()
      }),
      keys: ['prop1']
    })

    MyModel.get({prop1: 'value'}, (err, model) => {
      Code.expect(err).to.be.null()
      Code.expect(model.prop1).to.equal('value')
      Code.expect(model.save).to.be.function()
      Code.expect(model.saveWithTTL).to.be.function()
      Code.expect(model.del).to.be.function()
      done()
    })
  })
  lab.test('Delete saved model', (done) => {
    let MyModel = Storage.extend({
      name: 'myModel',
      props: Joi.object().keys({
        prop1: Joi.string(),
        prop2: Joi.string()
      }),
      keys: ['prop1']
    })
    MyModel.del({prop1: 'value'}, (err, nDeleted) => {
      Code.expect(err).to.be.null()
      Code.expect(nDeleted).to.equal(1)
      MyModel.get({prop1: 'value'}, (err, model) => {
        Code.expect(err).to.be.null()
        Code.expect(model).to.be.null()
        done()
      })
    })
  })
  lab.test('Save model with TTL', (done) => {
    let MyModel = Storage.extend({
      name: 'myModel2',
      props: Joi.object().keys({
        prop1: Joi.string(),
        prop2: Joi.string()
      }),
      keys: ['prop1']
    })
    let model = MyModel({prop1: 'value'})

    model.saveWithTTL(1, (err, message) => {
      Code.expect(err).to.be.null()
      Code.expect(message).to.equal('OK')
      done()
    })
  })
  lab.test('Get model with TTL', (done) => {
    let MyModel = Storage.extend({
      name: 'myModel2',
      props: Joi.object().keys({
        prop1: Joi.string(),
        prop2: Joi.string()
      }),
      keys: ['prop1']
    })

    setTimeout(() => {
      MyModel.get({prop1: 'value'}, (err, model) => {
        Code.expect(err).to.be.null()
        Code.expect(model).to.be.null()
        done()
      })
    }, 1000)
  })

  lab.test('Delete model', (done) => {
    let MyModel = Storage.extend({
      name: 'myModel3',
      props: Joi.object().keys({
        prop1: Joi.string(),
        prop2: Joi.string()
      }),
      keys: ['prop1']
    })
    let model = MyModel({prop1: 'value'})

    model.save((err, message) => {
      Code.expect(err).to.be.null()
      Code.expect(message).to.equal('OK')
      MyModel.get({prop1: 'value'}, (err, model) => {
        Code.expect(err).to.be.null()
        Code.expect(model.prop1).to.equal('value')
        model.del((err, nDeleted) => {
          Code.expect(err).to.be.null()
          Code.expect(nDeleted).to.equal(1)
          MyModel.get({prop1: 'value'}, (err, model) => {
            Code.expect(err).to.be.null()
            Code.expect(model).to.be.null()
            done()
          })
        })
      })
    })
  })

  lab.test('Try to get model but something bad happens', (done) => {
    let RedisStub = {
      createClient
    }
    let StorageStub = proxyquire('../../lib/storage', {
      'redis': RedisStub
    })
    let ShelfStub = proxyquire('../../index', {
      './lib/storage': StorageStub
    })

    const FakeStorage = ShelfStub('testApp', {
      host: '127.0.0.1',
      port: 6379
    })

    let MyModel = FakeStorage.extend({
      name: 'myModel',
      props: Joi.object().keys({
        prop1: Joi.string(),
        prop2: Joi.string()
      }),
      keys: ['prop1']
    })

    MyModel.get({prop1: 'value'}, (err, model) => {
      Code.expect(err).to.be.an.instanceof(Error)
      done()
    })

    function createClient () {
      return {
        get: (key, cb) => cb(new Error('something bad'))
      }
    }
  })
})
