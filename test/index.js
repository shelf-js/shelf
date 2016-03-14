'use strict';

var Lab = require('lab');
var Code = require('code');
var lab = exports.lab = Lab.script();
var Shelf = require('../index');
var Joi = require('joi');

lab.experiment('Shelf Init', function () {
  lab.test('Empty prefix', function (done) {
    var shelfInstance = Shelf(null, {
      host: '127.0.0.1',
      port: 6379
    });

    Code.expect(function () {
      return shelfInstance.extend();
    }).to.throw(Error, 'You need to define a valid prefix for the app');

    done();
  });

  lab.test('Invalid prefix', function (done) {
    var shelfInstance = Shelf(123, {
      host: '127.0.0.1',
      port: 6379
    });

    Code.expect(function () {
      return shelfInstance.extend();
    }).to.throw(Error, 'You need to define a valid prefix for the app');

    done();
  });

  lab.test('Empty name', function (done) {
    var shelfInstance = Shelf('Test', {
      host: '127.0.0.1',
      port: 6379
    });

    Code.expect(function () {
      return shelfInstance.extend({ name: null });
    }).to.throw(Error, 'You need to define a valid name for the model');

    done();
  });

  lab.test('Invalid name', function (done) {
    var shelfInstance = Shelf('Test', {
      host: '127.0.0.1',
      port: 6379
    });

    Code.expect(function () {
      return shelfInstance.extend({ name: 123 });
    }).to.throw(Error, 'You need to define a valid name for the model');

    done();
  });

  lab.test('Invalid Props', function (done) {
    var shelfInstance = Shelf('Test', {
      host: '127.0.0.1',
      port: 6379
    });

    Code.expect(function () {
      return shelfInstance.extend({ name: '123', props: { isJoi: false } });
    }).to.throw(Error, 'Model 123: must have props defined as a Joi Object Schema');

    done();
  });

  lab.test('Invalid Props', function (done) {
    var shelfInstance = Shelf('Test', {
      host: '127.0.0.1',
      port: 6379
    });

    Code.expect(function () {
      return shelfInstance.extend({ name: '123', props: { isJoi: true, _type: 'array' } });
    }).to.throw(Error, 'Model 123: must have props defined as a Joi Object Schema');

    done();
  });

  lab.test('Invalid Props', function (done) {
    var shelfInstance = Shelf('Test', {
      host: '127.0.0.1',
      port: 6379
    });

    Code.expect(function () {
      return shelfInstance.extend({ name: '123', props: Joi.object().keys({}) });
    }).to.throw(Error, 'Model 123: must have at least one property defined');

    done();
  });

  lab.test('Invalid Props', function (done) {
    var shelfInstance = Shelf('Test', {
      host: '127.0.0.1',
      port: 6379
    });

    Code.expect(function () {
      return shelfInstance.extend({ name: '123', props: Joi.object().keys({ prop1: Joi.string() }) });
    }).to.throw(Error, 'Model 123: must have at least one key defined');

    done();
  });

  lab.test('Invalid Props', function (done) {
    var shelfInstance = Shelf('Test', {
      host: '127.0.0.1',
      port: 6379
    });

    Code.expect(function () {
      return shelfInstance.extend({
        name: '123',
        props: Joi.object().keys({ prop1: Joi.string() }),
        keys: ['prop1.name2']
      });
    }).to.throw(Error, 'Model 123: The model\'s keys need to be root properties');

    done();
  });

  lab.test('Invalid Props', function (done) {
    var shelfInstance = Shelf('Test', {
      host: '127.0.0.1',
      port: 6379
    });

    Code.expect(function () {
      return shelfInstance.extend({
        name: '123',
        props: Joi.object().keys({ prop1: Joi.string() }),
        keys: ['prop2']
      });
    }).to.throw(Error, 'Model 123: The model\'s key prop2 need to be a defined property in Shelf.extend');

    done();
  });

  lab.test('OK', function (done) {
    var shelfInstance = Shelf('Test');

    shelfInstance.extend({
      name: '123',
      props: Joi.object().keys({ prop1: Joi.string() }),
      keys: ['prop1']
    });
    done();
  });
});