/*global angular $*/

module.exports = angular.module('BookPagesModule')
 .controller('AllBookPageController', ['$scope','BooksSvc', 
    function($scope, BooksSvc){
 
    $scope.newBook = {
      name: '',
      imgUrl: '',
      description:'',
      owner_id : '',
      owner_name:'',
      lenders_id : [],
      returnBookToOnwer: false
    };
    
    // will hold all the books
    $scope.books = [];
    
    $scope.btnClassByStatus = function(status) {
        var classBtn = 'btn-primary';
        
        switch(status){
          case 'Requested' :
              classBtn = 'btn-default';
              break;
          case 'Borrowed' :
              classBtn = 'btn-info';
              break;
          case 'Declined' :
              classBtn = 'btn-warning';
              break;
        }
        
        return classBtn;
    };
    
    
    
    $scope.requestStatus = function(user, book){
       var status = 'Request';
       user.pendingRequestsToUsers.forEach(function(request){
           if (request.status === 'Returned') {
                status = 'Request';
           }
           
           if (request.status === 'pending' && request.book._id === book._id){
               status = 'Requested';
           }
           
           if (request.status === 'approved' && request.book._id === book._id){
               status = 'Borrowed';
           }
           
           if (request.status === 'declined' && request.book._id === book._id){
               status = 'Declined';
           }

       });
        return status;    
    };
    
    
    BooksSvc.getAllBooks()
        .then(
            function(res){
            	if (res.data.state === 'success') {
            		$scope.books = res.data.books;
                
            	} else {
            		$scope.message = res.data.message;
            		
            	}
            	$scope.alertClass = res.data.state == 'success' ? 'alert-success' : 'alert-warning';
            },
            function(error) {
	        	$scope.message = 'error getting to the server : ' + error.status + ' ' + error.statusText;
	        }              
    );
    
    $scope.addBook = function(user) {
      $scope.newBook.owner_id = user._id;
      $scope.newBook.owner_name = user.name;
      
      BooksSvc.newBook($scope.newBook)
        .then(
            function(res){
                 if (res.data.state === "success") {
                				$scope.books.push(res.data.book);
            	   		} 
          	   			 // error, grab the error message from the response and display it on the form.
          	   		    $scope.message = res.data.message;
          	   		    $scope.alertClass = res.data.state == 'success' ? 'alert-success' : 'alert-warning';
            	   		$scope.newBook = {name:'', imgUrl: ''};
        	   		    // hides modal
        	   		    $('#newBookModal').modal('hide');                  				
            },
            function(error) {
      	        $scope.message = 'error getting to the server : ' + error.status + ' ' + error.statusText;
	        } 
        );
    };
    
    $scope.deleteBook = function(bookId, bookIdx){
        if (confirm('Are you sure you want to delete this book?')) {
            BooksSvc.deleteBook(bookId)
            .then(
                function(res){
              	   	 $scope.books.splice(bookIdx, 1);
              	   	 // error, grab the error message from the response and display it on the form.
              	   	 $scope.message = res.data.message;
              	   	 $scope.alertClass = res.data.state == 'success' ? 'alert-success' : 'alert-warning';
                },
                function(error) {
          	        $scope.message = 'error getting to the server : ' + error.status + ' ' + error.statusText;
    	        } 
            );
        }
    };
    
    
    $scope.requestBook = function(book, user) {
            BooksSvc.requestBook(book, user)
                .then(
                 function (res) {
                     if (res.data.state == 'success'){
                         window.user = res.data.user;
                     }
                     $scope.message = res.data.message;
                     $scope.alertClass = res.data.state == 'success' ? 'alert-success' : 'alert-warning';
                     
                 },
                 function(error) {
          	        $scope.message = 'error getting to the server : ' + error.status + ' ' + error.statusText;
    	        } 
            );
    };
    
}]);