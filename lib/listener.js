var util         = require('util');
var EventEmitter = require('events');
var amqp         = require('amqplib/callback_api');

/**
 * Creates new gateway Listener object.
 *
 * @param {String} host Hostname of amqp server
 * @param {String} service Service name to listen for
 */
var Listener = function(host, service) {
  this.service = service;
  this.host    = host;

  EventEmitter.call(this);
};

util.inherits(Listener, EventEmitter);

/**
 * Start listener, waits for incoming RPC requests and emits
 * events based on the method.
 */
Listener.prototype.start = function() {
  var self = this;

  amqp.connect(self.host, function(err, conn) {

    conn.createChannel(function(err, ch) {
      console.log('Listening for requests from: ' + self.service);

      ch.assertExchange(self.service, 'fanout', {durable: false});

      ch.assertQueue('', {exclusive: true}, function(err, q) {
        ch.bindQueue(q.queue, self.service, '');

        ch.consume(q.queue, function(msg) {
          var body = JSON.parse(msg.content.toString());
          var method = body.payload.method;

          self.emit(method, body.payload, body.response);
          console.log("Emitting: %s", method, body);
        }, {noAck: true});
      });

    });
  });
};

module.exports = Listener;