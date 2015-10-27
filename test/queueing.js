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
  it("gives the donating user content if content exists", function(done){

  })
  it("adds cause to user list of pending content if no content exists", function(done){

  })
  it("adds the donor to the causes list of donors", function(done){

  })
  it("finds a user waiting for content when an entry is published", function(done){

  })
  it('does not give content to a user who is in line BEHIND another user', function(done){

  })
  it('does not give content from another cause', function(done){

  })
  it('emails the user to notify them of content', function(done){

  })
  it('marks the content as no longer being available', function(done){

  })
})
