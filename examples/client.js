var Gateway = require('../index');
var user = new Gateway.Request('amqp://localhost', 'user');

user.call('update', ['Andrew', 'andrew@ekoapp.com'], function(err, response) {
  console.log(response);
});

user.call('create', ['Andrew', 'andrew@ekoapp.com'], function(err, response) {
  console.log(response);
});

user.on('completed', function (conn) {
  conn.close();
  process.exit(0);
});