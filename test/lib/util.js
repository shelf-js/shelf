'use strict'

const Lab = require('lab')
const Code = require('code')
const lab = exports.lab = Lab.script()
const Util = require('../../lib/util')

lab.experiment('Util', () => {
  lab.test('Empty prefix', (done) => {
    try {
      Util.keyFn(null, '', '')
    } catch (err) {
      Code.expect(err).to.not.be.null()
      Code.expect(err.message).to.equal('Prefix must be a string')
      done()
    }
  })
  lab.test('Invalid prefix', (done) => {
    try {
      Util.keyFn(123, '', '')
    } catch (err) {
      Code.expect(err).to.not.be.null()
      Code.expect(err.message).to.equal('Prefix must be a string')
      done()
    }
  })
  lab.test('Empty name', (done) => {
    try {
      Util.keyFn('123', null, '')
    } catch (err) {
      Code.expect(err).to.not.be.null()
      Code.expect(err.message).to.equal('Name must be a string')
      done()
    }
  })
  lab.test('Invalid name', (done) => {
    try {
      Util.keyFn('123', {}, '')
    } catch (err) {
      Code.expect(err).to.not.be.null()
      Code.expect(err.message).to.equal('Name must be a string')
      done()
    }
  })
  lab.test('Empty keys', (done) => {
    try {
      Util.keyFn('123', 'name', null)
    } catch (err) {
      Code.expect(err).to.not.be.null()
      Code.expect(err.message).to.equal('Keys must be an array')
      done()
    }
  })
  lab.test('Invalid keys', (done) => {
    try {
      Util.keyFn('123', 'name', '')
    } catch (err) {
      Code.expect(err).to.not.be.null()
      Code.expect(err.message).to.equal('Keys must be an array')
      done()
    }
  })
  lab.test('Empty array keys', (done) => {
    try {
      Util.keyFn('123', 'name', [])
    } catch (err) {
      Code.expect(err).to.not.be.null()
      Code.expect(err.message).to.equal('Keys must have values')
      done()
    }
  })
  lab.test('Empty Object', (done) => {
    try {
      Util.keyFn('123', 'name', [1])()
    } catch (err) {
      Code.expect(err).to.not.be.null()
      Code.expect(err.message).to.equal('Invalid object to extract key')
      done()
    }
  })
  lab.test('Invalid Object', (done) => {
    try {
      Util.keyFn('123', 'name', [1])(123)
    } catch (err) {
      Code.expect(err).to.not.be.null()
      Code.expect(err.message).to.equal('Invalid object to extract key')
      done()
    }
  })
  lab.test('Keys not in Object', (done) => {
    try {
      Util.keyFn('123', 'name', ['age'])({name: 'name'})
    } catch (err) {
      Code.expect(err).to.not.be.null()
      Code.expect(err.message).to.equal('Missing the key age from the keys object')
      done()
    }
  })
  lab.test('OK', (done) => {
    let key = Util.keyFn('123', 'test', ['name'])({name: 'name'})
    Code.expect(key).to.equal('123:test:name')
    done()
  })
})
