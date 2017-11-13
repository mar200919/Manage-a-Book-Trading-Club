/*global angular*/
module.exports = angular.module('BookPagesModule', []).service('BooksSvc', ['$http', function($http) {
            
            this.getAllBooks = function(){
                return $http.get('/books');  
            };
            
            // creates new book
            this.newBook = function(newBook) {
                return $http.post('/books', newBook);
            };
            
            this.deleteBook = function(bookId) {
                return $http.delete('/books/' + bookId);  
            };
            
            this.requestBook = function(book, user){
                var request = {
                    user: user,
                    book : book
                };
                
                return $http.put('/books/', request);
            };
}]);