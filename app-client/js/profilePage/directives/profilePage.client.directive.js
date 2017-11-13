/*global angular*/
module.exports = angular.module('ProfilePageModule')
 .directive('myBooksProfile',function(){
     return {
         templateUrl: 'views/profilePage/directives/myBooks.profile.html'
     };
 }).directive('borrowedBooksProfile',function(){
     return {
         templateUrl: 'views/profilePage/directives/borrowedBooks.profile.html'
     };
 }).directive('pendingRequestModal',function(){
     return {
         templateUrl: 'views/profilePage/directives/pendingRequestsModal.profile.html'
     };
 }).directive('proposedRequestModal',function(){
     return {
         templateUrl: 'views/profilePage/directives/proposedRequestsModal.profile.html'
     };
 }).directive('updateCityState',function(){
     return {
         templateUrl: 'views/profilePage/directives/updateCityAndStateModal.profile.html'
     };
 })