#DirectGiving API

##Hello and welcome to the DirectGiving API. We hope you find your stay comfortable and welcoming. Breakfast is served at 11.

**DirectGiving is a RESTful API built using IBM Loopback.**

It can be run locally by:

1. `heroku git:remote --app directgiving-api`
2. `heroku git:clone --app directgiving-api`
3. mirror your env with heroku's (using export and `heroku config`)
4. npm install
5. node .

Once running, the API can be explored at `/explorer`.
That will serve as documentation for routes, expected parameters, etc.

###*Donations*
are handled via stripe connect. Whenever a new organization is created, they are assigned a new managed account, and all payments are processed accordingly

###*Content*
when a new entry is published, a few things happen:
1. we grab all users who have donated to the entry's cause
2. we find (if any) a user who has donated but not received a specialized entry
3. we assign content to them. if no users are pending, then it is added without an assigned donor [functionally placing it in the queue]

###*Onboarding*
[tbd]
