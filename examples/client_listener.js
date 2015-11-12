var Listener = require('../listener');

var user = new Listener('localhost', 'user');
user.start();

user.on('create', function(payload, respons) {
  console.log('User created with ID: %d', response.id);
});

user.on('update', function(payload, respons) {
  console.log('User updated with ID: %d', response.id);
});