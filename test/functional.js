var should  = require('should');
var Server  = require('../server');
var Request = require('../request');

var host = 'localhost';
var api  = {
  sum: function(args, callback) {
    callback(null, args.x + args.y);
  }
};

describe('Gateway', function () {

  it('should start a server and listen for incoming rpc requests', function (done) {
    var s = new Server(host, 'test', api);
    s.start();

    var r = new Request(host);

    r.call('test', 'sum', {x: 1, y: 6}, function (err, response) {
      response.should.equal(7);
    });

    r.call('test', 'nothinghere', {path: '/some/file/path.jpg'}, function(err, response) {
      err.message.should.equal('Method test.nothinghere does not exist');
    });

    r.on('completed', function(conn) {
      conn.close();
      done();
    });

  });

});