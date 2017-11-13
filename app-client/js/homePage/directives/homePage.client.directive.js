/*global angular*/
module.exports = angular.module('HomePageModule')
 .directive('aboutUs',function(){
     return {
         templateUrl: 'views/homePage/directives/aboutUs.html'
     };
 });