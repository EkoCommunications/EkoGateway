var util         = require('util');
var EventEmitter = require('events');
var amqp         = require('amqplib/callback_api');

/**
 * Creates new gateway server object.
 *
 * @param {String} host Hostname of amqp server
 * @param {String} service Service name
 * @param {Object} exposes Object containing available methods
 */
var Server = function(host, service, exposes) {
  this.exposes = exposes;
  this.service = service;
  this.host    = host;
  this.conn    = null;

  EventEmitter.call(this);
};

util.inherits(Server, EventEmitter);

/**
 * Starts gateway server and listens for incoming rpc calls
 * once call is received, runs method and returns results
 * back to the originating queue.
 */
Server.prototype.start = function() {
  var self = this;

  amqp.connect('amqp://' + self.host, function(err, conn) {
    // Assign connection to class
    self.conn = conn;

    // Listen for incoming RPC calls
    conn.createChannel(function(err, ch) {
      ch.assertQueue(self.service, {durable: true});
      ch.prefetch(1);

      console.log('Awaiting RPC request for: ' + self.service);

      // Waiting for Request.call
      ch.consume(self.service, function reply(msg) {
        var payload = JSON.parse(msg.content.toString());
        var method  = self.exposes[payload.method];
        var methodName = self.service + '.' + payload.method;

        if (method === undefined) {
          var error = 'Method ' + methodName + ' does not exist';
          console.error(error);

          sendToQueue(ch, msg, {error: error});
        } else {
          console.log('Received: ' + msg.content.toString());
          console.log('Calling ' + methodName);

          // Calling method from Request.call
          console.time(methodName);

          payload.arguments.push(function (err, response) {

            // Responding to Request.call with response from method
            sendToQueue(ch, msg, response);
            console.timeEnd(methodName);

            // Send payload and response to listeners
            self.emit('completed', payload, response);
          });

          method.apply(method, payload.arguments);
        }
      });
    });

    // Publish completed RPC to subscribers
    conn.createChannel(function (err, ch) {
      ch.assertExchange(self.service, 'fanout', {durable: false});
      self.on('completed', function(payload, response) {
        var message = JSON.stringify({
          payload: payload,
          response: response
        });

        ch.publish(self.service, '', new Buffer(message));
        console.log("Published", message);
      });
    });

  });
};

/**
 * Sends response to the queue
 *
 * @param {Object} channel amqp channel object
 * @param {Object} message amqp message object
 * @param {Object} response Response from RPC method
 */
function sendToQueue(channel, message, response) {
  var response = new Buffer(JSON.stringify(response));
  var replyTo  = message.properties.replyTo;
  var id       = message.properties.correlationId;

  channel.sendToQueue(replyTo, response, {correlationId: id});
  channel.ack(message);
};

module.exports = Server;