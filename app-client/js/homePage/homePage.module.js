/*global angular*/

//exports module
module.exports = angular.module('HomePageModule',[]);

// require all controllers, services, directives
require("./controllers/homePage.client.controller");
require("./directives/homePage.client.directive");