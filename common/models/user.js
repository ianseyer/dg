module.exports = function(user) {
  clearacl.clearBaseACLs(user, require('./user.json'));
};
