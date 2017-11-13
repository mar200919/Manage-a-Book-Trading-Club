var MongoClient = require("mongodb").MongoClient;
var ObjectID = require('mongodb').ObjectID;
var assert = require('assert');

module.exports = function(passport) {
    
    //connecting to the database
    MongoClient.connect(process.env.MONGOURI, function(err, db){
    //fb strategy
    assert.equal(err, null, 'Error occured while connecting to the database');
    var usersCollection = db.collection('users');
    
    //facebook strategy
    require("./strategies/fb")(passport, db);
  
    //twitter strategy
    require("./strategies/twitter")(passport, db);
    
    //local strategy
    require('./strategies/local')(passport,db);

    // Passport needs to be able to serialize and deserialize users to support persistent login sessions
    passport.serializeUser(function(user, done) {
      // tell passport which id to use for user
      console.log('serializing user: ', user._id);
      return done(null, user._id);
    });

    passport.deserializeUser(function(id, done) {
        // return user object back
        var o_id = new ObjectID(id);
        
        usersCollection.find({'_id': o_id}).toArray(function(err, user) {
          if (err) {
            return done(err, false);
          }
    
          if (user.length < 1) {
            return done('user not found', false);
          }
          
          console.log('Derializing user: ' + id);
          return done(null, user[0]);
    
        });
    });
 
  });
  
};