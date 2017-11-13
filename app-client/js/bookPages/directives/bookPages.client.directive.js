/*global angular*/
module.exports = angular.module('BookPagesModule')
 .directive('allBooks',function(){
     return {
         templateUrl: 'views/bookPages/directives/allBooks.html'
     };
 }).directive('addBook', function(){
     return {
       templateUrl: 'views/bookPages/directives/addBook.html'
     };
 });