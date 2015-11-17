var Gateway = require('../index');

var user = new Gateway.Listener('amqp://localhost', 'user');
user.start();

user.on('create', function(payload, response) {
  console.log('User created with ID: %d', response.id);
});

user.on('update', function(payload, response) {
  console.log('User updated with ID: %d', response.id);
});