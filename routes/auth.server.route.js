var express = require('express');
var router = express.Router();
var authCtrl =  require("../controllers/auth.server.controller");

module.exports = function(passport){
	
	//log in local
	router.post('/login', passport.authenticate('login', authCtrl.localLoginLogic));
	//sign up local
	router.post('/signup', passport.authenticate('signup', authCtrl.localLoginLogic));
	
	//sends failure login state back to angular
	router.get('/failure', authCtrl.failure);


	// TWITTER
	router.get('/twitter', passport.authenticate('twitter'));
	router.get('/twitter/callback', 
	  passport.authenticate('twitter', authCtrl.socialLoginLogic)
	);

	
	// FACEBOOK
	router.get('/facebook', passport.authenticate('facebook'));
	router.get('/facebook/callback',
	  passport.authenticate('facebook', authCtrl.socialLoginLogic)
	);

	router.get('/signout', authCtrl.logout);
	
	router.get('/userState', authCtrl.checkUserState);
	
	return router;
};