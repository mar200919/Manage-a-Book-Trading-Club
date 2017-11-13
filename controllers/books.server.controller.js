require('dotenv').load();
var ObjectID = require('mongodb').ObjectID;

var MongoClient = require("mongodb").MongoClient;
var assert = require("assert");

exports.addNewBook = function(req, res, next) {
    //connecting to the database
    MongoClient.connect(process.env.MONGOURI, function(err, db){
        assert.equal(err, null, 'Error occured while connecting to the database');
        
        var books = db.collection('books');
        
        // checks if book is already in the collection
        books.find({ name: req.body.name}).toArray(function(err, docs){
          assert.equal(err, null,'Error finding book');
          //if found, advise user to request book
          if (docs.length >= 1) {
            console.log('book found');
            res.send({state:'failure', book: null, message:'Book is already on the collection, please request book from owner'});
          } else {
                books.insertOne(req.body, function(err, result){
                  assert.equal(err, null,'error inserting book');
                  assert.equal(result.result.ok, 1, 'problem inserting book');
                  // and return inserted user
                  console.log('inserted book: ' + result.insertedCount);
                  res.send({state:'success', book: result.ops[0], message:'New Book Added'});
                });
        }});
        
        
    });    
};


exports.sendAllBooks = function(req, res, next){
    
    //connecting to the database
    MongoClient.connect(process.env.MONGOURI, function(err, db){
        assert.equal(err, null, 'Error occured while connecting to the database');
        
        var books = db.collection('books');
        
        // sends books to client
        books.find({}).toArray(function(err, docs){
          assert.equal(err, null,'Error finding books');
          if (docs.length >= 1) {
            console.log('books found');
            res.send({state:'success', books: docs});
          } else {
            res.send({state:'failure', books: null, message:'Error finding books'});
        }});
        
        
    });
    
};


exports.sendUserBooks = function(req,res,next) { 
    var allBooks = {
        ownedBooks : null,
        borrowedBooks : null
    };
    
    var userId = req.params.userId;
    console.log(userId);
    
    //connecting to the database
    MongoClient.connect(process.env.MONGOURI, function(err, db){
        assert.equal(err, null, 'Error occured while connecting to the database');
        var books = db.collection('books');
        
        
        // sends books to client
        books.find({'owner_id' : userId }).toArray(function(err, ownedBooks){
          assert.equal(err, null,'Error finding owned books');
          
          if (ownedBooks.length >= 1) {
            allBooks.ownedBooks = ownedBooks;
            
            books.find({'lenders_id' : userId }).toArray(function(err, borrowedBooks){
               assert.equal(err, null,'Error finding borrowed books');
               if (borrowedBooks.length >= 1) {
                allBooks.borrowedBooks = borrowedBooks;
                
                //send owned and borrowed books
                res.send({state:'success', books: allBooks, message:'All Books found'});
               } 
               
               else {
                res.send({state:'success', books: allBooks, message:'only owned books found'});  
               }
            });
            
          } 
          else {
            res.send({state:'failure', books: null, message:'Error finding owned books'});
          }
            
        });
       
        
    });
}; 

exports.deleteBook = function (req, res, next){
    MongoClient.connect(process.env.MONGOURI, function(err, db) {
        
        assert.equal(err, null, 'Error deleting books');
        
        var bookId = req.params.bookId;
        
        // delete book from collection
        var o_id = new ObjectID(bookId);
        
        var books = db.collection('books');
        
        books.deleteOne({'_id' : o_id}, function(err, result){
          
          assert.equal(err, null, 'error deleting book');
          
          if (result.deletedCount == 0) {
            res.send({state:'failure', book: null, message:'Book was not deleted'});
          } else {
            res.send({state:'success', book: null, message:'Book deleted'});
          }
          
        });
        
    });  
};


exports.requestBook = function(req, res, next){
  
  var bookRequested = req.body.book;
  var userRequesting = req.body.user;
  var bookOwner = new ObjectID(bookRequested.owner_id);
  var userRequestingId = new ObjectID(userRequesting._id);
  
  var request = {
    user : userRequesting,
    book : bookRequested
  };
  
  var proposedRequest = {
    status: 'pending',
    book : bookRequested,
    reasonForDecline: ''
  };
  
 
  
  MongoClient.connect(process.env.MONGOURI, function(err, db) {
       assert.equal(err, null, 'Error connecting to the database'); 
       
       var users = db.collection('users');
       
       // Step1:  check if user already requested book
       users.find({'_id' : userRequestingId, 'pendingRequestsToUsers' : bookRequested._id}).toArray(function(err, docs){
           assert.equal(err, null, 'Error checking if user has document');
           if (docs.length >= 1){
                res.send({state:'failure', message:'Book already requested'});
           } else {
               
               
                // Step 2: Notify the owner of the book about the request
               users.findOneAndUpdate({'_id' :  bookOwner}, {
                 $push : {
                   'pendingRequestsFromUsers' : request
                 }
                },
                 function(err, result){
                   assert.equal(err, null, 'Error requesting to user');
                   
                   if (result.ok == 1) {
                       
                    // Step 3: Add book to the list of requested books
                     users.findOneAndUpdate({'_id' :  userRequestingId}, 
                     {
                       $push : {
                         'pendingRequestsToUsers' : proposedRequest  //to check if book was already requested on the client
                       }
                     },
                     {
                      returnOriginal: false
                     }, 
                     function(err, result){
                       assert.equal(err, null, 'Error adding to requests list');
                        if (result.ok == 1) {
                        // Step4:  Send updated user and response.    
                          res.send({state:'success', message:'Book Requested', user: result.value});
                        } else {
                          res.send({state:'failure', message: 'book was not requested', user: result.value});
                        }
                     });
                    
                   } else {
                     res.send({state:'failure', message: 'book was not requested'});
                   }
                   
                });
           }
       });
  });
};