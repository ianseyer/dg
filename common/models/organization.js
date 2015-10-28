var stripe = require('stripe')(process.env.SECRET_KEY)

module.exports = function(Organization) {
  /*
    Latches onto POST /organizations,
    and creates a stripe connect account, and associates it with the bank account provided from the signup form.
    @param [String] bankToken

    NOT TESTED
  */
  // Organization.observe('before save', function createStripeConnectAccount(ctx, next){
  //   stripe.accounts.create({
  //     country: "US",
  //     email: ctx.instance.email,
  //     managed: true,
  //     external_account: ctx.instance.bankToken
  //   })
  //   .then(function(account){
  //     ctx.instance.updateAttributes(
  //       {
  //         'stripeId':account.id, 'stripeSecret':account.keys.secret, 'stripePublishable':account.keys.publishable
  //       }
  //     )
  //     .then(function(organization){
  //       console.log('successfully created new stripe account')
  //       next(organization)
  //     })
  //     .catch(function(err){
  //       console.log(err);
  //       next(err);
  //     })
  //   })
  //   .catch(function(err){
  //     console.log(err);
  //     next(err);
  //   })
  // })
};
