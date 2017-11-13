require('dotenv').load();
var ObjectID = require('mongodb').ObjectID;

var MongoClient = require("mongodb").MongoClient;
var assert = require("assert");

exports.acceptRequest = function(req,res,next){

  //Step1: Grab all the required ids, book request, book owner and user requesting
  var bookRequestedId = new ObjectID(req.body.book._id);
  var bookOwnerId = new ObjectID(req.body.book.owner_id);
  var userRequestingId = new ObjectID(req.body.user._id);
  

  MongoClient.connect(process.env.MONGOURI, function(err, db) {
       assert.equal(err, null, 'Error connecting to the database'); 
       
       var users = db.collection('users');
       var books = db.collection('books');
       //Step2: send requestor user id to the list of lenders id
       books.findOneAndUpdate({'_id' : bookRequestedId}, {
           $push: {
               'lenders_id' : req.body.user._id
           }
       },
       {
          returnOriginal: false
       }, function(err, result1){
           assert.equal(err, null, 'Error adding to user to book lender list');
           
           if (result1.ok == 1) {
               //Step3: set status to approved on requestor pending request to users status
               users.findOneAndUpdate({'_id' : userRequestingId, 'pendingRequestsToUsers.book._id' : req.body.book._id}, {
                   "$set" : {
                       'pendingRequestsToUsers.$.status' : 'approved'
                   }
               }, function(err, result2){
                   assert.equal(err, null, 'Error approving request on user requesting');
                   
                   if (result2.ok == 1){
                       // step4: remove request from pending request from user array
                       users.findOneAndUpdate(
                           {'_id' : bookOwnerId}, 
                           {
                           "$pull" : { "pendingRequestsFromUsers" : { "book._id" : req.body.book._id }}
                           },
                       {
                          returnOriginal: false
                       }, function(err, result3) {
                          assert.equal(err, null, 'Error error removing from pending request list');
                          
                          if (result3.ok == 1) {
                              //send response to client
                              res.send({state:'success', message:'request approved'});
                          } else {
                              res.send({state:'failure', message:'request denied'});
                          }
                       }
                       );
                   } else {
                      res.send({state:'failure', message:'request denied'});
                    }
               });
           } else {
              res.send({state:'failure', message:'request denied'});
           }
       });
  });
  
  
};


exports.declineRequest = function(req,res,next){
  
  //Step1: Grab all the required ids, book request, book owner and user requesting
  var bookOwnerId = new ObjectID(req.body.book.owner_id);
  var userRequestingId = new ObjectID(req.body.user._id);
  

  MongoClient.connect(process.env.MONGOURI, function(err, db) {
       assert.equal(err, null, 'Error connecting to the database'); 
       
       var users = db.collection('users');
       
       //Step2: set status to declined on requestor pending request to users status
       users.findOneAndUpdate({'_id' : userRequestingId, 'pendingRequestsToUsers.book._id' : req.body.book._id}, {
           "$set" : {
               'pendingRequestsToUsers.$.status' : 'declined'
           }
       }, function(err, result2){
           assert.equal(err, null, 'Error approving request on user requesting');
           
           if (result2.ok == 1){
               // step4: remove request from pending request from user array
               users.findOneAndUpdate(
                   {'_id' : bookOwnerId}, 
                   {
                   "$pull" : { "pendingRequestsFromUsers" : { "book._id" : req.body.book._id }}
                   },
               {
                  returnOriginal: false
               }, function(err, result3) {
                  assert.equal(err, null, 'Error error removing from pending request list');
                  
                  if (result3.ok == 1) {
                      //send response to client
                      res.send({state:'success', message:'request denied'});
                  } else {
                      res.send({state:'failure'});
                  }
               }
               );
           } else {
              res.send({state:'failure'});
            }
       });    
  });    
    
    
};



exports.cancelRequest = function(req,res,next){
  
  //Step1: Grab all the required ids, book request, book owner and user requesting
  var bookOwnerId = new ObjectID(req.body.book.owner_id);
  var bookId = req.body.book._id;
  var userRequestingId = new ObjectID(req.user._id);
  
  
  MongoClient.connect(process.env.MONGOURI, function(err, db) {
       assert.equal(err, null, 'Error connecting to the database'); 
       
       var users = db.collection('users');
       
       //Step2: remove request from pending request to user
       users.findOneAndUpdate(
           {'_id' : userRequestingId}, 
           {
           "$pull" : { "pendingRequestsToUsers" : { "book._id" : bookId }}
                       
           }, function(err, result2){
                assert.equal(err, null, 'Error removing request from pending request to user');
           
           if (result2.ok == 1){
               // step3: remove request from pending request from owner user array
               users.findOneAndUpdate(
                   {'_id' : bookOwnerId}, 
                   {
                   "$pull" : { "pendingRequestsFromUsers" : { "book._id" : req.body.book._id }}
                   },
               {
                  returnOriginal: false
               }, function(err, result3) {
                  assert.equal(err, null, 'Error error removing from pending request list');
                  
                  if (result3.ok == 1) {
                      //send response to client
                      res.send({state:'success', message:'request denied'});
                  } else {
                      res.send({state:'failure'});
                  }
               }
               );
           } else {
              res.send({state:'failure'});
            }
       });    
  }); 
    
};

exports.returnBook = function(req, res, next) {
      //Step1: Grab all the required ids
      var bookBorrowedId = new ObjectID(req.body._id);
      var userReturningBook =  new ObjectID(req.user._id);
      
      MongoClient.connect(process.env.MONGOURI, function(err, db) {
         assert.equal(err, null, 'Error connecting to the database');
         
         var books = db.collection('books');
         var users = db.collection('users');
         
         
         // if this is the last user returning the book, set the return to owner field to false;
         if (req.body.lenders_id.length == 1) {
            books.findOneAndUpdate({'_id' : bookBorrowedId},{
               '$set' : {returnBookToOnwer : false} 
            }, {
                upsert: true
            }, function(err, result0){
                assert.equal(err, null, 'error setting return to owner false');
                assert.equal(result0.ok, 1,'error while completing setting the return to owner to false');
                
            }); 
         }
         
         
         
         //Step2: remove user from the books lenders id
         books.findOneAndUpdate({'_id' : bookBorrowedId},
            {
                "$pull" : { 'lenders_id' : String(req.user._id)}
            },
               {
                  returnOriginal: false
               }, function(err, result1) {
                assert.equal(err, null, 'error removing user id from lenders id');
                if (result1.ok == 1) {
                   //Step3: set status to returned on requestor pending request to users status
                   users.findOneAndUpdate({'_id' : userReturningBook, 'pendingRequestsToUsers.book._id' : req.body._id}, {
                       "$set" : {
                           'pendingRequestsToUsers.$.status' : 'Returned'
                       }
                   },function(err, result2){
                       if (result2.ok == 1) {
                           assert.equal(err, null, 'Error setting status to returned');
                           res.send({state:'success', message: 'book returned'});
                       } else {
                          res.send({state: 'failure' , message: 'error returning the book'}); 
                       }
                   });
                } else {
                    res.send({state: 'failure' , message: 'error returning the book'});
                }
            }
         );
         
      });
      
};

exports.requestBookBack = function (req, res, next) {
    var bookId = new ObjectID(req.body._id);
    
    MongoClient.connect(process.env.MONGOURI, function(err, db){
       assert.equal(err, null, 'error connecting to the database'); 
       var books = db.collection('books');
       
       books.findOneAndUpdate({'_id': bookId}, {
           '$set': {
               returnBookToOnwer : true
           }
       }, {
           upsert: true
       }, function(err, result){
           assert.equal(err, null, 'Error requesting book back');
           if (result.ok == 1){
               res.send({state:'success', message:'book requested back'});
           } else {
               res.send({state: 'failure', message: 'book not requested back'});
           }
       });
        
        
    });
    
};


exports.updateCityAndState = function (req, res, next) {
    var userId = new ObjectID(req.params.id);
    
    MongoClient.connect(process.env.MONGOURI, function(err, db){
       assert.equal(err, null, 'error connecting to the database'); 
       var users = db.collection('users');
       
       users.findOneAndUpdate({'_id': userId}, {
           '$set': {
               city : req.body.city,
               state: req.body.state
           }
       }, {
           upsert: true,
           returnOriginal : false
       }, function(err, result){
           assert.equal(err, null, 'Error updating user city and state');
           if (result.ok == 1){
               res.send({state: 'success', message:'City and State updated', user : result.value});
           } else {
               res.send({state: 'failure', message: 'City and State not updated'});
           }
       });
        
        
    });
    
};