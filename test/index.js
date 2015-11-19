var Lab = require('lab')
var Code = require('code')
var lab = exports.lab = Lab.script()
var TestSchema = require('./testSchema')

lab.experiment('Model creation', function () {
  lab.test('Default values', function (done) {
    var test = new TestSchema({prop1: 'Hello'})
    Code.expect(test.prop1).to.equal('Hello')
    Code.expect(test.prop2).to.equal('World')
    done()
  })
})
