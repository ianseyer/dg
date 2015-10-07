var config = require('../../server/config.json');
var path = require('path');

var subscription = require('../helpers/subscription.js');
var clearacl = require('../helpers/clearacl.js');
var stripe = require('stripe')(process.env.SECRET_KEY);

/* email verification & password reset */
module.exports = function(donor) {
  //first, clear our ACLs.
  //as described here: https://github.com/strongloop/loopback/issues/559
  clearacl.clearBaseACLs(donor, require('./donor.json'));

  //send verification email after registration
};
