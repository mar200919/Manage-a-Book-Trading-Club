/*global angular*/

module.exports = angular.module('HomePageModule')
 .controller('HomePageController', ['$scope', 
    function($scope){
    $scope.features = ['Catalogue your books online' , 'See all of the books our users own', 'Request to borrow other users\' books', 'Easily manage books and requests from your dashboard']
}]);