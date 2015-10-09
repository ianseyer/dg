var stripe = require('stripe')(process.env.SECRET_KEY);
var app = require('../../server/server');

module.exports = function(Donation) {
  //Define custom routes
  Donation.create = function(donor, amount, cb){
    stripe.charges.create({
      customer: donor.stripeId,
      amount: amount*100,
      currency: 'USD',
    })
    .then(function(charge){
      cb(null, charge)
    })
    .catch(function(err){
      cb(err, null)
    })
  }

  Donation.addCard = function(donor, token, cb){
    console.log(donor)
    console.log(token)
    app.models.Donor.findById(donor.id)
    .then(function(instance){
      stripe.customers.create({
        source: token,
        email: instance.email
      })
      .then(function(customer){
        instance.updateAttribute('stripeId', customer.id)
        .then(function(instance){
          cb(null, instance)
        })
      })
      .catch(function(err){
        console.log('error in adding card')
        console.log(err);
        cb(err, null);
      })
    })
    .catch(function(err){
      cb(err, null)
    })
  }

  //Register our routes, and provide metadata for documentation purposes
  Donation.remoteMethod(
    'create',
    {
      path: {path: '/donate', verb: 'post'},
      accepts: [
        {arg: 'donor', type:'Object', required:true},
        {arg: 'amount', type:'Number', required:true}
      ],
      returns: {arg: 'response', type:'string'},
      description: 'Processes stripe donation based on stored customerId for received Donor.'
    }
  )

  Donation.remoteMethod(
    'addCard',
    {
      path: {path: '/addCard', verb: 'post'},
      accepts: [
        {arg: 'donor', type:'Object', required:true},
        {arg: 'token', type:'String', required:true}
      ],
      returns: {arg: 'response', type:'string'},
      description: 'Creates a new stripe customer based on the card information, then saves that customer ID to the user object.'
    }
  )
};
