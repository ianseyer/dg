var clearACLs = require('./clearacl.js');

module.exports = function(user) {
  clearACLs.clearBaseACLs(user, require('./user.json'));
};
