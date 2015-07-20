module.exports = function(user) {
  user.donate = function(stripeToken, amount, cb) {
    // Set your secret key: remember to change this to your live secret key in production
    // See your keys here https://dashboard.stripe.com/account/apikeys
    var stripe = require("stripe")("sk_test_WfMEMY5PfzRdZxPGZY0Y6OHb");

    // (Assuming you're using express - expressjs.com)
    // Get the credit card details submitted by the form
    var stripeToken = data.stripeToken;
    var response;
    stripe.customers.create({
      source: stripeToken,
      email: email,
      description: projectId
    }).then(function(customer) {
      return stripe.charges.create({
        amount: amount, // amount in cents
        currency: "usd",
        customer: customer.id
      });
    }).then(function(charge) {
      response = "Thanks for the donation!"
      saveStripeCustomerId(user, charge.customer);
    });

    cb(null, response);
  }

  user.remoteMethod(
    'donate',
    {
      http: {path: '/users/:id/donate', verb: 'post'},
      accepts: [
        {arg: 'id', type: 'number', required: true},
        {arg: 'projectId', type: 'number', required: true},
        { arg: 'stripeToken', type: 'string', required: true, http: {source: 'body'}},
        { arg: 'amount', type: 'number', required: true, http: {source: 'body'}},
        { arg: 'email', type: 'string', required: true, http: {source: 'body'}}],
      returns: {arg: 'response', type: 'string'}
    }
  )
};
