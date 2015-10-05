var chai = require('chai'),
    supertest = require('supertest'),
    api = supertest('http://localhost:3000');

var stripe = require('stripe')(process.env.SECRET_KEY);
chai.use(require("chai-as-promised"))
var should = chai.should()

testDonor = {
  "causes": [
    ""
  ],
  "content": [
    ""
  ],
  "stripeId": "cus_6pJK65q0pMVhlG",
  "realm": "",
  "username": "",
  "credentials": "object",
  "challenges": "object",
  "email": "mr.test@gmail.com",
  "emailVerified": false,
  "verificationToken": "",
  "status": "",
  "created": "",
  "lastUpdated": "",
  "id": 0
}

var testToken;
stripe.tokens.create(
  {
    card: {
      "number": '4242424242424242',
      "exp_month": 12,
      "exp_year": 2022,
      "cvc": '123'
    }
  }
)
.then(function(token){
  testToken = token.id;
})
.catch(function(err){
  throw(err)
})

describe('Making a donation', function(){
  it("errors if it doesn't receive donor object", function(done){
    api.post('/api/donations/create')
    .send({'donor':null, 'amount':200})
    .expect(400, done)
  });

  it("errors if it doesn't receive an amount", function(done){
    api.post('/api/donations/create')
    .send({'donor':testDonor})
    .expect(400, done)
  });

  it("errors if donor object is invalid", function(done){
    api.post('/api/donations/create')
    .send({'donor':{"invalid":"donor"}, "amount":200})
    .expect(500, done)
  });

  it("errors if amount is not a number", function(done){
    api.post('/api/donations/create')
    .send({'donor':testDonor, "amount":"dog"})
    .expect(400, done)
  });

  it('succeeds if both items are present and accurate', function(done){
    api.post('/api/donations/create')
    .send({'donor':testDonor, 'amount':100})
    .expect(200, done)
  });
});

describe('Adding a card', function(){
  it("errors if it doesn't receive donor object", function(done){
    api.post('/api/donations/addCard')
    .send({'token':'valid'})
    .expect(400, done)
  });

  it("errors if it doesn't receive a token", function(done){
    api.post('/api/donations/addCard')
    .send({'donor':testDonor})
    .expect(400, done)
  });

  it("errors if donor object is invalid", function(done){
    api.post('/api/donations/addCard')
    .send({'donor':{"invalid":"donor"}, "token":"valid"})
    .expect(500, done)
  });

  it("succeeds if token and donor is valid", function(done){
    api.post('/api/donations/addCard')
    .send({'donor':testDonor, 'token':testToken})
    .expect(200, done)
  })
})
