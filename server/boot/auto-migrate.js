clearACLs = require('../../common/helpers/clearacl.js');
acls = require('../../common/helpers/user-acls.json');

module.exports = function(app) {
  /*
  If anything has changed, synchronize model definition and db schema
  Otherwise, don't do anything!
  note: passing null to isActual and autoupdate performs the function for all models
  */
  app.dataSources.postgres.autoupdate(function(err, result) {
    //...
  });
}
