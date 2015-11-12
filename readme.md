# EkoGateway

EkoGateway is a message bus that facilitates calls between microservices and clients. There are three (3) main components. The server, the request and the listener.

## Installation

	npm install @andreweko/ekogateway
	
## Usage

There are two (2) general use cases for the gateway. RPC calls between clients and microservices and subscribers that listen for RPC calls from microservices.

### Remote Procedure Calls

RPC calls will need a `Server` running and a `Request` to make the calls to the server.

**server.js**

	var Server = require('server');
	
	var api = {
		sum: function(x, y, callback) {
			callback(null, x + 7);
		}
	};
	
	var server = new Server('localhost', 'calculator', api);
	server.start();

**client.js**

	var Request = require('request');
	var calculator = new Request('localhost', 'calculator');
	
	calculator.call('sum', [4, 9], function(err, response) {
		console.log(response) //This will be 13
	});
	
	calculator.on('completed', function (conn) {
	  conn.close();
	  process.exit(0);
	});


### Subscribing to RPC calls with a Listener

Using the same example above you can subscribe to the calculator service and listen for when certain methods are called. You get the full payload from the request back as well as the response back when the event has been called.

**listener.js**

	var Listener = require('listener');
	var calculator = new Listener('localhost', 'calculator');
	
	calculator.on('sum', function(payload, response) {
		console.log(response) // This will be 13
	});