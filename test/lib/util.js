'use strict';

var Lab = require('lab');
var Code = require('code');
var lab = exports.lab = Lab.script();
var Util = require('../../lib/util');

lab.experiment('Util', function () {
  lab.test('Empty prefix', function (done) {
    Code.expect(function () {
      return Util.keyFn(null, '', '');
    }).to.throw(Error, 'Prefix must be a string');

    done();
  });
  lab.test('Invalid prefix', function (done) {
    Code.expect(function () {
      return Util.keyFn(123, '', '');
    }).to.throw(Error, 'Prefix must be a string');

    done();
  });
  lab.test('Empty name', function (done) {
    Code.expect(function () {
      return Util.keyFn('123', null, '');
    }).to.throw(Error, 'Name must be a string');

    done();
  });
  lab.test('Invalid name', function (done) {
    Code.expect(function () {
      return Util.keyFn('123', {}, '');
    }).to.throw(Error, 'Name must be a string');

    done();
  });
  lab.test('Empty keys', function (done) {
    Code.expect(function () {
      return Util.keyFn('123', 'name', null);
    }).to.throw(Error, 'Keys must be an array');

    done();
  });
  lab.test('Invalid keys', function (done) {
    Code.expect(function () {
      return Util.keyFn('123', 'name', '');
    }).to.throw(Error, 'Keys must be an array');

    done();
  });
  lab.test('Empty array keys', function (done) {
    Code.expect(function () {
      return Util.keyFn('123', 'name', []);
    }).to.throw(Error, 'Keys must have values');

    done();
  });
  lab.test('Empty Object', function (done) {
    Code.expect(function () {
      return Util.keyFn('123', 'name', [1])();
    }).to.throw(Error, 'Invalid object to extract key');

    done();
  });
  lab.test('Invalid Object', function (done) {
    Code.expect(function () {
      return Util.keyFn('123', 'name', [1])(123);
    }).to.throw(Error, 'Invalid object to extract key');

    done();
  });
  lab.test('Keys not in Object', function (done) {
    Code.expect(function () {
      return Util.keyFn('123', 'name', ['age'])({ name: 'name' });
    }).to.throw(Error, 'Missing the key age from the keys object');

    done();
  });
  lab.test('OK', function (done) {
    var key = Util.keyFn('123', 'test', ['name'])({ name: 'name' });
    Code.expect(key).to.equal('123:test:name');
    done();
  });
});