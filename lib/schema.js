'use strict';

var Joi = require('joi');
var util = require('./util');

function Schema(options) {
  var storage = options.storage;
  var prefix = options.prefix;
  var name = options.name;
  var keys = options.keys;

  var key = util.keyFn(prefix, name, keys);

  var Model = function Model(properties) {
    return Joi.validate(properties, options.props, function (err, model) {
      if (err) {
        throw err;
      }

      keys.forEach(function (key) {
        if (model[key] === undefined) {
          throw new Error('Model missing key: ' + key);
        }
      });

      var stringModel = JSON.stringify(model);
      model.save = function (cb) {
        var myKey = key(this);
        storage.set(myKey, stringModel, cb);
      };

      // TTL in seconds
      model.saveWithTTL = function (ttl, cb) {
        var myKey = key(this);
        storage.setex(myKey, ttl, stringModel, cb);
      };

      model.del = function (cb) {
        var myKey = key(this);
        storage.del(myKey, cb);
      };
      return model;
    });
  };

  Model.get = function (keyObj, cb) {
    var myKey = key(keyObj);
    storage.get(myKey, function (err, propsJson) {
      if (err) {
        return cb(new Error('Error loading model: ' + err.message));
      }
      if (!propsJson) {
        return cb(null, null);
      }

      var properties = JSON.parse(propsJson);

      return cb(null, Model(properties));
    });
  };

  Model.del = function (keyObj, cb) {
    var myKey = key(keyObj);
    storage.del(myKey, cb);
  };

  return Model;
}

module.exports = Schema;