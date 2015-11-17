var should  = require('should');
var Gateway = require('../index');

var host = 'amqp://localhost';
var api  = {
  sum: function(x, y, callback) {
    callback(null, x + y);
  },
  addFive: function (args, callback) {
    callback(null, args + 5);
  }
};

describe('Gateway', function () {

  it('should start a server and listen for incoming rpc requests', function (done) {
    var s = new Gateway.Server(host, 'test', api);
    var r = new Gateway.Request(host, 'test');
    var l = new Gateway.Listener(host, 'test');

    s.start(true);
    l.start();

    r.call('sum', [1, 7], function (err, response) {
      response.should.equal(8);
    });

    r.call('addFive', 5, function (err, response) {
      console.log("RESPONSE", response);
      response.should.equal(10);
    });

    r.call('nothinghere', {path: '/some/file/path.jpg'}, function(err, response) {
      err.message.should.equal('Method test.nothinghere does not exist');
    });

    r.on('completed', function(conn) {
      conn.close();
      done();
    });

  });

});