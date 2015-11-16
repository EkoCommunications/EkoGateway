var util         = require('util');
var EventEmitter = require('events');
var amqp         = require('amqplib/callback_api');
var _            = require('underscore');

/**
 * Creates new gateway request object.
 *
 * @param {String} host Hostname of amqp server
 */
var Request = function(host, service) {
  this.host     = host;
  this.service  = service;
  this.requests = {};

  EventEmitter.call(this);
};

util.inherits(Request, EventEmitter);

/**
 * Creates a RPC to specified service using the gateway
 *
 * @param {String} service Name of service to call method on
 * @param {String} method Name of method
 * @param {Array|Object|String|Integer} arguments List of arguments
 * @param {Function} callback(err, response) Function called to send response back to client
 */
Request.prototype.call = function(method, arguments, callback) {
  var id         = generateUuid();
  var service    = this.service;
  var methodName = service + '.' + method;

  if (arguments.constructor !== Array) {
    arguments = [arguments];
  }

  // Mark request as running
  this.requests[id] = false;

  var payload = JSON.stringify({
    method: method,
    arguments: arguments
  });

  console.time('Request: ' + methodName);
  amqp.connect('amqp://' + this.host, function(err, conn) {
    conn.createChannel(function(err, ch) {
      ch.assertQueue('', {exclusive: true}, function(err, q) {
        console.log('Requesting ' + method + ' from ' + service);

        // This is waiting for the response from the server
        ch.consume(q.queue, function(msg) {
          if (msg.properties.correlationId == id) {

            var response       = msg.content.toString();
            var responseObject = JSON.parse(response);

            if (responseObject.hasOwnProperty('error')) {
              callback(new Error(responseObject.error), null);
            } else {
              callback(null, responseObject);
            }

            // Mark request as completed
            this.requests[id] = true;
            console.timeEnd('Request: ' + methodName);

            // Make sure all requests are complete before closing connection
            if (requestsCompleted(this.requests)) {
              this.emit('completed', conn);
            }
          }
        }.bind(this));

        // This is sending the payload to the server
        ch.sendToQueue(service, new Buffer(payload), {correlationId: id, replyTo: q.queue});

      }.bind(this));
    }.bind(this));
  }.bind(this));
};

/**
 * Determine whether all requests are complete
 *
 * @param {Object} requests Key value pair of requests and completed status
 */
function requestsCompleted(requests) {
  var complete = true;

  _.each(requests, function(element) {
    if (element === false) {
      complete = false;
    }
  });

  return complete;
}

/**
 * Randomly generate UUID for correlation ID
 */
function generateUuid() {
  return Math.random().toString() +
         Math.random().toString() +
         Math.random().toString();
}

module.exports = Request;