![shelf Logo](https://avatars1.githubusercontent.com/u/14891842?v=3&s=200)

Object Document Mapper (ODM) for Node.js who uses Redis as its store.

[![Build Status](https://travis-ci.org/shelf-js/shelf.svg?branch=master)](https://travis-ci.org/shelf-js/shelf)
[![npm version](https://img.shields.io/npm/v/shelf.svg)](https://www.npmjs.com/package/shelf)

# Introduction

If you need to store complex objects do Redis, but don't want to go through the trouble of translating your objects to a key, value store, then Shelf is for you.
Shelf gives you CRUD operation on your objects over Redis, so you can create complex schemas and validate models.

Shelf uses [joi](https://github.com/hapijs/joi) for schema validation.

# Example

```javascript
const Shelf = require('shelf')
const Joi = require('joi')

const myModel = Shelf('MyApp', {
  port: 6379,
  host: '127.0.0.1'
})
.extend({
  name: 'MySchema',
  props: Joi.object().keys({
    prop1: Joi.string(),
    prop2: Joi.string()
  }),
  keys: ['prop1']
})({prop1: 'Hello'})

myModel.save()
```

You can (and should) move your DB connection (Shelf) and Schema (returned by the extend method) to different files to get better readability.

Check the examples for further information.

# Contributing

We use [standard js](https://github.com/feross/standard).

In order to run the tests you should have an Redis instance running locally.
