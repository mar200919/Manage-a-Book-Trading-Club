var TwitterStrategy = require("passport-twitter").Strategy;
var assert = require('assert');

module.exports = function(passport, db) {
  var usersCollection = db.collection('users');
  passport.use('twitter', new TwitterStrategy({
      consumerKey: process.env.TWITTER_KEY,
      consumerSecret: process.env.TWITTER_SECRET,
      callbackURL: process.env.BASEURL+'auth/twitter/callback'
    },
    function(token, tokenSecret, profile, done) {
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
    }
  ));
};