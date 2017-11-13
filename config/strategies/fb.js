// npm module to read .env variables
require('dotenv').load();
var assert = require("assert");
var FacebookStrategy = require("passport-facebook").Strategy;

module.exports = function(passport, db) {
  var usersCollection = db.collection('users');
  passport.use('facebook', new FacebookStrategy({
      clientID: process.env.FB_CLIENT_ID,
      clientSecret: process.env.FB_CLIENT_SECRET,
      callbackURL:  process.env.BASEURL + 'auth/facebook/callback'
    },
    // facebook will send back the tokens and profile
    function(access_token, refresh_token, profile, done) {
      // asynchronous
      process.nextTick(function() {
        // first, try to find the user.
        usersCollection.find({ name: profile.displayName}).toArray(function(err, docs){
          assert.equal(err, null,'Error finding user');
          //if found, send user
          if (docs.length >= 1) {
            console.log('document found');
            return done(null, docs[0]);
          } else {
            //if not, create new user
            var newUser = {
              name : profile.displayName,
              city: '',
              state: '',
              myBooksIDs : [],
              pendingRequestsFromUsers : [],
              pendingRequestsToUsers : []
            };
            usersCollection.insertOne(newUser, function(err, result){
              assert.equal(err, null,'error inserting user');
              assert.equal(result.result.ok, 1, 'problem inserting document');
              // and return inserted user
              console.log('inserted document: ' + result.insertedCount);
              return done(null, result.ops[0]);
            });
            
          }
        });
      });
    }));
};