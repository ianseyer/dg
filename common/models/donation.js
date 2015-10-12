var stripe = require('stripe')(process.env.SECRET_KEY);
var app = require('../../server/server');

module.exports = function(Donation) {
  //Define custom routes

  //after a POST to /api/donations, create the charge via stripe
  Donation.observe('before save', function chargeStripe(ctx, next) {
    if (ctx.instance) {
      app.models.Donor.findById(ctx.instance.donorId)
      .then(function(donor){
        stripe.charges.create({
          customer: donor.stripeId,
          amount: ctx.instance.amount*100,
          currency:'USD'
        })
        .then(function(charge){
          next();
        })
        .catch(function(err){
          console.log(err)
          next();
        })
      })
    } else {
      next();
    }
  });


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
