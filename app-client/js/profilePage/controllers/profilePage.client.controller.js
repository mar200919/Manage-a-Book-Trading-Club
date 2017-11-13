/*global angular $*/

module.exports = angular.module('ProfilePageModule')
 .controller('ProfilePageController', ['$scope','$routeParams', 'ProfileBooksSvc', 'ProfileUserSvc', 
    function($scope, $routeParams, ProfileBooksSvc, ProfileUserSvc){

     $scope.updateCityAndStateForm = {
       city : '',
       state: ''
     };
     
     $scope.updateCityAndState = function(userId) {
         ProfileUserSvc.updateCityAndState($scope.updateCityAndStateForm, userId)
          .then(
            function(res){
               if (res.data.state == 'success'){
                  window.user = res.data.user;
               }
               
               $scope.messageProfile = res.data.message;
               $scope.alertClassProfile = res.data.state == 'success' ? 'alert-success' : 'alert-warning';
               // hides modal
        	   $('#updateCityAndState').modal('hide');
               
            }, 
            function(err){
              if (err) {
                $scope.messageProfile = err;
                $('#updateCityAndState').modal('hide');
              }
          });
     };

     $scope.removeOrCancel = function(request) {
        if (request.status == 'pending'){
         return 'Cancel';
        } else {
         return 'Remove';
        }
     };

     ProfileBooksSvc.getUserBooks($routeParams.user)
      .then(
       function(res){
        $scope.myBooks =  res.data.books.ownedBooks;
        $scope.borrowedBooks = res.data.books.borrowedBooks;
      }, 
      function(err){
        $scope.messageProfile = err;
      }
    );
    
    $scope.acceptRequest = function(request, requestId){
     if (confirm('if you accept you will not be able to delete the book until the book is returned, is that ok?')) {
       ProfileBooksSvc.acceptRequest(request)
        .then(function(res){
          if (res.data.state == 'success'){
            window.user.pendingRequestsFromUsers.forEach(function(requests, idx){
                if (requests.book._id == requestId) {
                  window.user.pendingRequestsFromUsers.splice(idx, 1);
                }
            });
          }
          
        },
           function(err){
            $scope.messageProfile = err;
           }
         );
     }
    };
    
    $scope.declineRequest = function(request, requestId){
     ProfileBooksSvc.declineRequest(request)
      .then(function(res){
        if (res.data.state == 'success'){
          window.user.pendingRequestsFromUsers.forEach(function(requests, idx){
              if (requests.book._id == requestId) {
                window.user.pendingRequestsFromUsers.splice(idx, 1);
              }
          });
        }
        
      },
         function(err){
          $scope.messageProfile = err;
         }
       );
    };
    
    $scope.cancelRequest = function(request) {
      ProfileBooksSvc.cancelRequest(request)
       .then(function(res){
         if (res.data.state == 'success'){
           window.user.pendingRequestsToUsers.forEach(function(requests, idx){
               if (requests.book._id == request.book._id ) {
                 window.user.pendingRequestsToUsers.splice(idx, 1);
               }
           });
         }
         
       },
          function(err){
           $scope.messageProfile = err;
          }
        );
    };
    
    $scope.returnBook = function(book) {
      ProfileBooksSvc.returnBook(book)
      .then(function(res){
         if (res.data.state == 'success'){
           $scope.borrowedBooks.forEach(function(borrowedBook, idx){
               if (borrowedBook._id == book._id ) {
                 $scope.borrowedBooks.splice(idx, 1);
                 window.user.pendingRequestsToUsers.forEach(function(requests, idx){
                  if (requests.book._id == book._id ) {
                    window.user.pendingRequestsToUsers[idx].status = 'Returned';
                  }
                });
               }
           });
         }
         
       },
          function(err){
           $scope.messageProfile = err;
          }
        );
    };
    
    $scope.requestBookBack = function(book) {
      ProfileBooksSvc.requestBookBack(book)
      .then(function(res){
         if (res.data.state == 'success'){
           $scope.myBooks.forEach(function(myBook, idx){
               if (myBook._id == book._id ) {
                 $scope.myBooks[idx].returnBookToOnwer = true;
               }
           });
         }
         
       },
          function(err){
           $scope.messageProfile = err;
          }
        );
    };
}]);