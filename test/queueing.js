var chai = require('chai'),
    supertest = require('supertest'),
    api = supertest('http://localhost:3000');

var stripe = require('stripe')(process.env.SECRET_KEY);
chai.use(require("chai-as-promised"))
var should = chai.should()
var testEntry = require('./data').testEntry

var makeDonation = function(user, amount){

}
describe("Content Queueing", function(){
  it("gives donating user content if content exists", function(done){

  })
  it("adds cause to user list of pending content if no content exists", function(done){

  })
  it("finds a user waiting for content when an entry is published", function(done){

  })
})
