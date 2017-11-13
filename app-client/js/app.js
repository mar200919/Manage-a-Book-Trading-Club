/*global angular location*/
require('angular');
require('angular-route');

window.$ = window.jQuery = require('jquery');
require('bootstrap');

//require sub-modules
require("./homePage/homePage.module");
require("./profilePage/profilePage.module");
require("./bookPages/bookPages.module");

angular.module('BookTradingClub', ['ngRoute', 'HomePageModule', 'ProfilePageModule','BookPagesModule'])
    .config(function($routeProvider, $locationProvider) {
      $routeProvider
       .when('/', {
        templateUrl: 'views/homePage/homePage.html',
        controller: 'HomePageController'
      })
      .when('/books',{
        templateUrl: 'views/bookPages/allBooksPage.html',
        controller: 'AllBookPageController',
		resolve : {
			// checks for userstate before granting access to this route
			userState : function($http, $location){
				$http.get('auth/userState').then(function(res){
					if(res.data.state === "failure") {
						$location.path('/');
					}
				});
			}
		}
      })
      .when('/profile/:user', {
        templateUrl: 'views/profilePage/profilePage.html',
        controller: 'ProfilePageController',
		resolve : {
			// checks for userstate before granting access to this route
			userState : function($http, $location){
				$http.get('auth/userState').then(function(res){
					if(res.data.state === "failure") {
						$location.path('/');
					}
				});
			}
		}
      }).otherwise({
        redirectTo: '/'
      });
      
}).controller('BookTradingClubController',['$scope', '$http',
    function($scope, $http){
        $scope.currentUser = function() {
            return window.user ? window.user : null;
        };
        
        $scope.signOut = function(){
            $http.get('/auth/signout').then(function(r){
                if (r.status == 200) {
                    location.reload();
                }
            });
        };
}]);