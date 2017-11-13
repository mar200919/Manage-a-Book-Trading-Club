/*global angular*/
module.exports = angular.module('ProfilePageModule', []).service('ProfileBooksSvc', ['$http', function($http) {
            
            this.getUserBooks = function(userId){
                return $http.get('/books/' + userId );  
            };
            
            this.acceptRequest = function(request){
                return $http.put('/profile/accept', request);
            };
            
            this.declineRequest = function(request){
                return $http.put('/profile/decline', request);
            };
            
            this.cancelRequest = function(request){
                return $http.put('/profile/cancel', request);
            };
            
            this.returnBook = function(book){
                return $http.put('/profile/return', book);
            };
            
            this.requestBookBack = function(book){
                return $http.put('/profile/requestBookBack', book);
            };
            
}]).service('ProfileUserSvc', ['$http', function($http){
                
            this.updateCityAndState = function(cityAndState, userId) {
                return $http.put('/profile/' + userId,  cityAndState)
            };    
    
}]);