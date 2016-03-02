'use strict'

const Lab = require('lab')
const Code = require('code')
const lab = exports.lab = Lab.script()
const Util = require('../../lib/util')

lab.experiment('Util', () => {
  lab.test('Empty prefix', (done) => {
    Code.expect(
      () => Util.keyFn(null, '', '')
    ).to.throw(Error, 'Prefix must be a string')

    done()
  })
  lab.test('Invalid prefix', (done) => {
    Code.expect(
      () => Util.keyFn(123, '', '')
    ).to.throw(Error, 'Prefix must be a string')

    done()
  })
  lab.test('Empty name', (done) => {
    Code.expect(
      () => Util.keyFn('123', null, '')
    ).to.throw(Error, 'Name must be a string')

    done()
  })
  lab.test('Invalid name', (done) => {
    Code.expect(
      () => Util.keyFn('123', {}, '')
    ).to.throw(Error, 'Name must be a string')

    done()
  })
  lab.test('Empty keys', (done) => {
    Code.expect(
      () => Util.keyFn('123', 'name', null)
    ).to.throw(Error, 'Keys must be an array')

    done()
  })
  lab.test('Invalid keys', (done) => {
    Code.expect(
      () => Util.keyFn('123', 'name', '')
    ).to.throw(Error, 'Keys must be an array')

    done()
  })
  lab.test('Empty array keys', (done) => {
    Code.expect(
      () => Util.keyFn('123', 'name', [])
    ).to.throw(Error, 'Keys must have values')

    done()
  })
  lab.test('Empty Object', (done) => {
    Code.expect(
      () => Util.keyFn('123', 'name', [1])()
    ).to.throw(Error, 'Invalid object to extract key')

    done()
  })
  lab.test('Invalid Object', (done) => {
    Code.expect(
      () => Util.keyFn('123', 'name', [1])(123)
    ).to.throw(Error, 'Invalid object to extract key')

    done()
  })
  lab.test('Keys not in Object', (done) => {
    Code.expect(
      () => Util.keyFn('123', 'name', ['age'])({name: 'name'})
    ).to.throw(Error, 'Missing the key age from the keys object')

    done()
  })
  lab.test('OK', (done) => {
    let key = Util.keyFn('123', 'test', ['name'])({name: 'name'})
    Code.expect(key).to.equal('123:test:name')
    done()
  })
})
