var Server = require('../../../server');
var path   = require('path');
var api    = require('apitree').createApiTree(path.join(__dirname, '.'));

var server = new Server('localhost', 'file', api);
server.start();