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

  //using a stripe token, generate a stripe customer and store the id in the user
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

  /*
  NOTE This is the first step of the content queue, it is triggered after a donation is created. It:
    1. grabs the donor who made the donation
    2. finds all entries that
      a. belong to the donation cause
      b. have no donor
    3. assigns that entry to the donor
    4. emails that donor to notify them!
  */
  // Donation.observe('after save', function addUserToQueue(ctx, next){
  //   if(ctx.instance){
  //     app.models.Donor.findById(ctx.instance.donorId)
  //     .then(function(donor){
  //       app.models.Entry.find({
  //         {order: 'created DESC'},
  //         {where:
  //           {
  //             and: [
  //               {causeId:ctx.instance.causeId}, //that cause
  //               {donorId:null} //and unassigned
  //             ]
  //           }
  //         }
  //       })
  //       .then(function(unused){
  //         if(unused.length === 0){
  //           /*
  //           This handles a situation where no content was found for a new donor.
  //           It:
  //             1. Appends that cause to the donor's waitingForContentFrom
  //             2. Email the user to let them know!
  //           */
  //           donor.updateAttribute('waitingForContentFrom', donor.waitingForContentFrom.push(ctx.instance.causeId))
  //           .then(function(donor){
  //             email = new Email({
  //               to: donor.email,
  //               from: process.env.SENDER_EMAIL,
  //               subject: "Content coming soon!",
  //               text: "Hi there! Thank you for your donation to "+ctx.instance.causeId+". Unfortunately, we don't have content for you! Please wait for a while, and we'll let you know as soon as it is available!"
  //             })
  //             email.send()
  //             .then(function(email){
  //               next()
  //             })
  //             .catch(function(err){
  //               console.log(err)
  //               //TODO handle the error appropriately
  //               next()
  //             })
  //           })
  //         }
  //         //add the oldest entry to the donor's entries
  //         donor.updateAttribute('entries', entries.push(unused.pop()))
  //         .then(function(donor){
  //           //email that user their piece of content
  //           email = new Email({
  //             to: donor.email,
  //             from: process.env.SENDER_EMAIL,
  //             subject: "You have an update from DirectGiving!",
  //             text: donor.entries.slice(-1)[0]
  //           })
  //           email.send()
  //           .then(function(email){
  //             next()
  //           })
  //           .catch(function(err){
  //             console.log(err);
  //             //TODO handle error properly
  //           })
  //         })
  //         .catch(function(err){
  //           console.log(err);
  //           //TODO handle error properly
  //         })
  //       })
  //       .catch(function(err){
  //         console.log(err);
  //         //TODO handle error properly
  //       })
  //     })
  //     .catch(function(err){
  //       console.log(err);
  //       //TODO handle error properly
  //     })
  //   }
  // })

  //register our method for HTTP
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
