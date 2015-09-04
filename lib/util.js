// Dependecies
var nodeUtil = require('util')
var extend = require('xtend')

var util = extend({}, nodeUtil)

util.isObject = function (item) {
  return Object.prototype.toString.call(item) === '[object Object]'
}

util.generator = require('./util/generator')

module.exports = util
