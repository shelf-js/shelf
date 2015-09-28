var generator = {}

generator.constructor = function (extendOptions) {
  var name = extendOptions.name
  var props = extendOptions.props
  var required = extendOptions.keys

  var throwErrorInternal = function (error) {
    throw new Error('Model ' + extendOptions.name + ': ' + error)
  }

  if (typeof extendOptions.required === 'object') {
    extendOptions.required.forEach(function (key) {
      if (required.indexOf(key) < 0) {
        required.push(key)
      }
    })
  }

  return function (properties, options) {
    properties = properties || {}
    options = options || {}

    var reqList = required.slice()
    var strict = typeof options.strict !== 'undefined' ? options.strict
                 : typeof extendOptions.strict !== 'undefined' ? extendOptions.strict
                 : true
    var enforce = typeof options.enforce !== 'undefined' ? options.enforce
                 : true
    var err

    // Store hidden options inside this instance
    Object.defineProperty(this, '__settings__', {
      configurable: false,
      enumerable: false,
      writable: false,
      value: {
        strict: strict,
        enforce: enforce
      }
    })

    // Recursive construction and validation of the object
    properties = recursiveValidation(properties, props, {strict: strict, enforce: enforce}, throwErrorInternal)

    reqList = reqList.filter(function (req) {
      // Is the requred property an
      // object ?
      if (req.indexOf('.') > 0) {
        var reqArray = req.split('.')

        if (recursiveObjRequired(reqArray, properties)) {
          return false
        }
      } else {
        if (properties[req]) {
          return false
        }
      }

      return true
    })

    // More detailed error message
    // for required properties
    if (reqList.length > 0) {
      err = 'Model ' + name + ': '
      if (reqList.length === 1) {
        err += 'The property ' + reqList[0] + ' is required'
      } else {
        err += 'The following properties are required -> '

        reqList.forEach(function (p) {
          err += p + ', '
        })
        err = err.substr(0, err.length - 2)
      }
    }

    // Error throw
    if (err) {
      throw new Error(err)
    }

    // Passing attributes to this
    // object
    for (var prop in properties) {
      if (properties.hasOwnProperty(prop)) {
        this[prop] = properties[prop]
      }
    }
  }
}

// Private method only used in generator constructor
function recursiveValidation (opt, properties, obj, throwFn) {
  var propertiesObject = {}

  var strict = obj.strict
  // Enforce validation
  // only valid if strict is false
  var enforce = obj.enforce

  for (var prop in opt) {
    if (opt.hasOwnProperty(prop)) {
      // Is it a object ?
      if (typeof properties[prop] === 'object') {
        // Just to be sure we dont
        // break anything
        if (typeof opt[prop] === 'object') {
          // call self
          propertiesObject[prop] = recursiveValidation(opt[prop], properties[prop], obj)
          continue
        } else {
          return throwFn('The property ' + prop + ' must be an object')
        }
      }

      if (strict) {
        if (typeof properties[prop] === 'undefined') {
          return throwFn('The strict mode is on, so you can only construct the model with properties defined')
        }

        // Type validation
        if (properties[prop] !== 'any' && properties[prop] !== typeof opt[prop]) {
          // This function can throw an error
          // or send the value converted
          opt[prop] = typeValidation(properties[prop], opt[prop], prop, throwFn)
        }
      } else {
        // Strict mode is off
        // so we only check the type
        // of the properties defined
        // on extend
        if (typeof properties[prop] !== 'undefined') {
          if (enforce) {
            // Type validation
            if (properties[prop] !== 'any' && properties[prop] !== typeof opt[prop]) {
              // This function can throw an error
              // or send the value converted
              opt[prop] = typeValidation(properties[prop], opt[prop], prop, throwFn)
            }
          }
        }
      }

      // Add it!
      propertiesObject[prop] = opt[prop]
    }
  }

  return propertiesObject
}

// Private method only used in generator constructor
function recursiveObjRequired (array, obj) {
  var result = false

  array.forEach(function (reqObj, i) {
    if (i + 1 !== array.length) {
      if (obj[reqObj]) {
        obj = obj[reqObj]
      } else {
        return
      }
    } else {
      if (obj[reqObj]) {
        result = true
      }
    }
  })

  return result
}

// Private method only used in generator constructor
function typeValidation (type, value, propertyName, throwFn) {
  // Exceptions must be
  // put here in this handle

  if (type === 'number' && typeof value === 'string') {
    var len = value.length

    if (len === parseFloat(value).toString().length) {
      return parseFloat(value)
    }
  }

  if (type === 'string' && typeof value === 'number') {
    return value.toString()
  }

  return throwFn('The property ' + propertyName + ' must be a ' + type)
}

generator.keyFn = function (prefix, name, keys) {
  return function (obj) {
    if (!obj) {
      throw new Error('When using methods, The object keys must be set with all the model keys')
    }

    var k = prefix + ':' + name + ':'
    keys.forEach(function (key) {
      if (obj[key]) {
        k += obj[key] + ':'
      } else {
        throw new Error('Missing the key ' + key + ' from the keys object')
      }
    })

    return k.slice(0, -1)
  }
}

module.exports = generator
