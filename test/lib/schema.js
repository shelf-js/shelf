'use strict';

var Lab = require('lab');
var Code = require('code');
var lab = exports.lab = Lab.script();
var Shelf = require('../../index');
var Joi = require('joi');
var proxyquire = require('proxyquire');

var Storage = Shelf('testApp', {
  host: '127.0.0.1',
  port: 6379
});

lab.experiment('Model', function () {
  lab.test('Missing key', function (done) {
    var MyModel = Storage.extend({
      name: 'myModel',
      props: Joi.object().keys({
        prop1: Joi.string(),
        prop2: Joi.string()
      }),
      keys: ['prop1']
    });

    Code.expect(function () {
      return MyModel({ prop2: 'cenas' });
    }).to.throw(Error, 'Model missing key: prop1');

    done();
  });

  lab.test('Invalid model', function (done) {
    var MyModel = Storage.extend({
      name: 'myModel',
      props: Joi.object().keys({
        prop1: Joi.string(),
        prop2: Joi.string()
      }),
      keys: ['prop1']
    });

    Code.expect(function () {
      return MyModel({ prop1: 1 });
    }).to.throw(Error, 'child "prop1" fails because ["prop1" must be a string]');

    done();
  });
  lab.test('Save model', function (done) {
    var MyModel = Storage.extend({
      name: 'myModel',
      props: Joi.object().keys({
        prop1: Joi.string(),
        prop2: Joi.string()
      }),
      keys: ['prop1']
    });
    var model = MyModel({ prop1: 'value' });

    model.save(function (err, message) {
      Code.expect(err).to.be.null();
      Code.expect(message).to.equal('OK');
      done();
    });
  });
  lab.test('Get saved model', function (done) {
    var MyModel = Storage.extend({
      name: 'myModel',
      props: Joi.object().keys({
        prop1: Joi.string(),
        prop2: Joi.string()
      }),
      keys: ['prop1']
    });

    MyModel.get({ prop1: 'value' }, function (err, model) {
      Code.expect(err).to.be.null();
      Code.expect(model.prop1).to.equal('value');
      Code.expect(model.save).to.be.function();
      Code.expect(model.saveWithTTL).to.be.function();
      Code.expect(model.del).to.be.function();
      done();
    });
  });
  lab.test('Delete saved model', function (done) {
    var MyModel = Storage.extend({
      name: 'myModel',
      props: Joi.object().keys({
        prop1: Joi.string(),
        prop2: Joi.string()
      }),
      keys: ['prop1']
    });
    MyModel.del({ prop1: 'value' }, function (err, nDeleted) {
      Code.expect(err).to.be.null();
      Code.expect(nDeleted).to.equal(1);
      MyModel.get({ prop1: 'value' }, function (err, model) {
        Code.expect(err).to.be.null();
        Code.expect(model).to.be.null();
        done();
      });
    });
  });
  lab.test('Save model with TTL', function (done) {
    var MyModel = Storage.extend({
      name: 'myModel2',
      props: Joi.object().keys({
        prop1: Joi.string(),
        prop2: Joi.string()
      }),
      keys: ['prop1']
    });
    var model = MyModel({ prop1: 'value' });

    model.saveWithTTL(1, function (err, message) {
      Code.expect(err).to.be.null();
      Code.expect(message).to.equal('OK');
      done();
    });
  });
  lab.test('Get model with TTL', function (done) {
    var MyModel = Storage.extend({
      name: 'myModel2',
      props: Joi.object().keys({
        prop1: Joi.string(),
        prop2: Joi.string()
      }),
      keys: ['prop1']
    });

    setTimeout(function () {
      MyModel.get({ prop1: 'value' }, function (err, model) {
        Code.expect(err).to.be.null();
        Code.expect(model).to.be.null();
        done();
      });
    }, 1000);
  });

  lab.test('Delete model', function (done) {
    var MyModel = Storage.extend({
      name: 'myModel3',
      props: Joi.object().keys({
        prop1: Joi.string(),
        prop2: Joi.string()
      }),
      keys: ['prop1']
    });
    var model = MyModel({ prop1: 'value' });

    model.save(function (err, message) {
      Code.expect(err).to.be.null();
      Code.expect(message).to.equal('OK');
      MyModel.get({ prop1: 'value' }, function (err, model) {
        Code.expect(err).to.be.null();
        Code.expect(model.prop1).to.equal('value');
        model.del(function (err, nDeleted) {
          Code.expect(err).to.be.null();
          Code.expect(nDeleted).to.equal(1);
          MyModel.get({ prop1: 'value' }, function (err, model) {
            Code.expect(err).to.be.null();
            Code.expect(model).to.be.null();
            done();
          });
        });
      });
    });
  });

  lab.test('Try to get model but something bad happens', function (done) {
    var RedisStub = {
      createClient: createClient
    };
    var StorageStub = proxyquire('../../lib/storage', {
      'redis': RedisStub
    });
    var ShelfStub = proxyquire('../../index', {
      './lib/storage': StorageStub
    });

    var FakeStorage = ShelfStub('testApp', {
      host: '127.0.0.1',
      port: 6379
    });

    var MyModel = FakeStorage.extend({
      name: 'myModel',
      props: Joi.object().keys({
        prop1: Joi.string(),
        prop2: Joi.string()
      }),
      keys: ['prop1']
    });

    MyModel.get({ prop1: 'value' }, function (err, model) {
      Code.expect(err).to.be.an.instanceof(Error);
      done();
    });

    function createClient() {
      return {
        get: function get(key, cb) {
          return cb(new Error('something bad'));
        }
      };
    }
  });
});