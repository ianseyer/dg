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
  donor.afterRemote('create', function(context, donor) {
    console.log('> donor.afterRemote triggered');
    /** Create stripe account */
    // stripe.customers.create({
    //   email: donor.email
    // })
    // .then(function(customer){
    //   donor.updateAttribute('stripeId', customer.id)
    //   .then(function(donor){
    //     console.log(donor)
    //   })
    //   .catch(function(error){
    //     console.log(error)
    //   })
    //   console.log(customer)
    // })

    // var options = {
    //   type: 'email',
    //   to: donor.email,
    //   from: 'support@directgiving.com',
    //   subject: 'Thanks for registering.',
    //   template: path.resolve(__dirname, '../../server/views/verify_email.ejs'),
    //   redirect: '/verified',
    //   donor: donor
    // };
    //
    // donor.verify(options, function(err, response) {
    //   if (err) {
    //     console.log(err);
    //     return;
    //   }
    //
    //   console.log('> verification email sent:', response);
    //
    //   context.res.render('response', {
    //     title: 'Signed up successfully',
    //     content: 'Please check your email and click on the verification link '
    //       + 'before logging in.',
    //     redirectTo: '/',
    //     redirectToLinkText: 'Log in'
    //   });
    // });
  });

  //send password reset link when requested
  donor.on('resetPasswordRequest', function(info) {
    var url = 'http://' + config.host + ':' + config.port + '/reset-password';
    var html = 'Click <a href="' + url + '?access_token=' + info.accessToken.id
      + '">here</a> to reset your password';

    donor.app.models.Email.send({
      to: info.email,
      from: info.email,
      subject: 'Password reset',
      html: html
    }, function(err) {
      if (err) return console.log('> error sending password reset email');
      console.log('> sending password reset email to:', info.email);
    });
  });
};
