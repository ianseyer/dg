var should = require('chai').should(),
    supertest = require('supertest'),
    api = supertest('http://localhost:3000');

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
})
