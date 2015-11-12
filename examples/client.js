var Request = require('../request');
var request = new Request('localhost');

request.call('user', 'update', ['Andrew', 'andrew@ekoapp.com'], function(err, response) {
  console.log(response);
});

request.call('user', 'create', ['Andrew', 'andrew@ekoapp.com'], function(err, response) {
  console.log(response);
});

request.call('user', 'create', ['Andrew', 'andrew@ekoapp.com'], function(err, response) {
  if (err) {
    console.error(err);
  } else {
    console.log(response);
  }
});

request.call('file', 'upload', '/some/file/path.jpg', function(err, response) {
  console.log(response);
});


// @todo: Check if method on service exists
request.call('file', 'nothinghere', '/some/file/path.jpg', function(err, response) {
  console.error(err);
});

request.on('completed', function (conn) {
  conn.close();
  process.exit(0);
});

// @todo: Check if service is running
// @todo: Error handling