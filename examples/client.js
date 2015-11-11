var Request = require('../request');
var request = new Request('localhost');

request.call('user', 'update', {name: 'Andrew', email: 'andrew@ekoapp.com'}, function(err, response) {
  console.log('user.update', response);
});

request.call('user', 'create', {name: 'Andrew', email: 'andrew@ekoapp.com'}, function(err, response) {
  console.log('user.create', response);
});

request.call('user', 'create', {name: 'Andrew', email: 'andrew@ekoapp.com'}, function(err, response) {
  if (err) {
    console.error('user.create', err);
  } else {
    console.log('user.create', response);
  }
});

request.call('file', 'upload', {path: '/some/file/path.jpg'}, function(err, response) {
  console.log('file.upload', response);
});


// @todo: Check if method on service exists
request.call('file', 'nothinghere', {path: '/some/file/path.jpg'}, function(err, response) {
  console.error(err);
});

request.on('completed', function (conn) {
  conn.close();
  process.exit(0);
});

// @todo: Check if service is running
// @todo: Error handling