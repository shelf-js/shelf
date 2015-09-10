// Dependecies
var redis = require('redis')

// hide this methods from our Storage API
var hideMethods = [
  'install_stream_listeners',
  'initialize_retry_vars',
  'unref',
  'flush_and_error',
  'on_error',
  'do_auth',
  'on_connect',
  'init_parser',
  'on_ready',
  'on_info_cmd',
  'ready_check',
  'send_offline_queue',
  'connection_gone',
  'on_data',
  'return_error',
  'return_reply',
  'send_command',
  'pub_sub_command'
]

function Storage () {
  var self = this
  var client = redis.createClient()

  var allMethods = Object.keys(Object.getPrototypeOf(client))

  var methods = allMethods.filter(function (fn) {
    return hideMethods.indexOf(fn) < 0
  })

  methods.forEach(function (method) {
    self[method] = function () {
      return client[method].apply(client, arguments)
    }
  })
}

module.exports = Storage
