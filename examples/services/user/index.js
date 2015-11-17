var Gateway = require('../../../index');
var path    = require('path');
var api     = require('apitree').createApiTree(path.join(__dirname, '.'));

var server = new Gateway.Server('amqp://localhost', 'user', api);
server.start(true);