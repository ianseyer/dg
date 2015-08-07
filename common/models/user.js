var clearACLs = require('clearacl');
module.exports = function(user) {
  clearACLs.clearBaseACLs(user, require('./user.json'));
};
