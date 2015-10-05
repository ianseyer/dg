var chai = require('chai'),
    should = chai.should(),
    supertest = require('supertest'),
    api = supertest('http://localhost:3000');

chai.use(require("chai-as-promised"))

describe('New entry published', function(){
  testSpaceId = 'ngwrqts9pn9q';
  testEntry = {
              "name": "Story",
              "description": "A content singleton. A short story about a particular person, for example.",
              "displayField": "title",
              "fields": [
                {
                  "name": "title",
                  "id": "title",
                  "type": "Symbol"
                },
                {
                  "name": "campaign",
                  "id": "campaign",
                  "type": "Link",
                  "linkType": "Entry",
                  "validations": []
                },
                {
                  "name": "images",
                  "id": "images",
                  "type": "Array",
                  "items": {
                    "type": "Link",
                    "linkType": "Asset"
                  }
                },
                {
                  "name": "body",
                  "id": "body",
                  "type": "Text"
                },
                {
                  "name": "location",
                  "id": "location",
                  "type": "Location"
                }
              ]
            }
  contentfulClient.publishEntry(testEntry);
  it("should assign the content to the first user in the queue, if there are users", function(done){

  })

  it("should do nothing if there are no users in the queue", function(done){

  })
});

describe("New user subscription", function(){

});
