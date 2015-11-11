module.exports = function(arguments, callback) {
  callback(null, {id: 1, name: arguments.name, email: arguments.email, message: 'User created successfully'});
};