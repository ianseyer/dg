var config = require('../../server/config.json');
var path = require('path');

var subscription = require('../helpers/subscription.js');
var clearacl = require('../helpers/clearacl.js');

/* email verification & password reset */
module.exports = function(user) {
  //first, clear our ACLs.
  //as described here: https://github.com/strongloop/loopback/issues/559
  clearacl.clearBaseACLs(user, require('./user.json'));

  //send verification email after registration
  user.afterRemote('create', function(context, user) {
    console.log('> user.afterRemote triggered');

    var options = {
      type: 'email',
      to: user.email,
      from: 'support@directgiving.com',
      subject: 'Thanks for registering.',
      template: path.resolve(__dirname, '../../server/views/verify_email.ejs'),
      redirect: '/verified',
      user: user
    };

    user.verify(options, function(err, response) {
      if (err) {
        next(err);
        return;
      }

      console.log('> verification email sent:', response);

      context.res.render('response', {
        title: 'Signed up successfully',
        content: 'Please check your email and click on the verification link '
          + 'before logging in.',
        redirectTo: '/',
        redirectToLinkText: 'Log in'
      });
    });
  });

  //send password reset link when requested
  user.on('resetPasswordRequest', function(info) {
    var url = 'http://' + config.host + ':' + config.port + '/reset-password';
    var html = 'Click <a href="' + url + '?access_token=' + info.accessToken.id
      + '">here</a> to reset your password';

    user.app.models.Email.send({
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
