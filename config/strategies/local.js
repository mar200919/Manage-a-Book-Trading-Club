// npm module to read .env variables
require('dotenv').load();

var LocalStrategy = require('passport-local').Strategy;
var bCrypt = require('bcrypt-nodejs');
var assert = require('assert');


module.exports = function (passport, db) {
    var usersCollection = db.collection('users');

    passport.use('login', new LocalStrategy({
    		passReqToCallback: true
    	},
    		function (req, username, password, done) {
    			usersCollection.find({ name: username }).toArray(function (err, user) {
                    assert.equal(err, null,'Error finding user');

    				//if there is no user with this username
    				if (!user.length >= 1) {
    					return done(null, false, {message: 'User not found'});
    				}
     				
    				// check if the password is correct
    				if (!isValidPassword(user[0], password)) {
    					return done(null, false, {message: 'Invalid Password'}); // redirect back to login page
    				}
     				
    				// successfully signed in
    				console.log('successfully signed in');
    				return done(null, user[0]);
    
    			});
    		}
    ));


	passport.use('signup', new LocalStrategy({
		passReqToCallback: true // allows us to pass back the entire request to the callback
	},
			function (req, username, password, done) {
				usersCollection.find({ name: username}).toArray(function(err, user){
                    assert.equal(err, null,'Error finding user');
					// Stage 1 : check if user exists
					if (user.length >= 1) {
					    return done(null, false, {message: 'User already exists'});
					} else {
            			//if not, create new user
                        var newUser = {
                          name : username,
                          password: createHash(password),
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
                              console.log('signed in new user: ' + result.insertedCount);
                              return done(null, result.ops[0]);
                        });
					}				
					
				});
			})
		);

	var isValidPassword = function (user, password) {
		return bCrypt.compareSync(password, user.password);
	};
	// Generates hash using bCrypt
	var createHash = function (password) {
		return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
	};

}; 