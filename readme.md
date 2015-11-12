# EkoGateway

EkoGateway is a message bus that facilitates calls between microservices and clients. There are three (3) main components. The server, the request and the listener.

## Installation

	npm install @andreweko/ekogateway
	
## Usage

There are two (2) general use cases for the gateway. RPC calls between clients and microservices and subscribers that listen for RPC calls from microservices.

### Remote Procedure Calls

RPC calls will need a microservice `Server` running and a `Request` to make the calls to the server.

**server.js**

	var Server = require('server');
	
	var api = {
		sum: function(x, y, callback) {
			callback(null, x + 7);
		}
	};
	
	var server = new Server('localhost', 'serviceName', api);
	server.start();

**client.js**


### Subscribing to RPC calls with a Listener