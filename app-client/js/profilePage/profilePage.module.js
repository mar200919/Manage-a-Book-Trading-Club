/*global angular*/

//exports module
module.exports = angular.module('ProfilePageModule',[]);

// require all controllers, services, directives
require("./services/profilePage.client.service");
require("./controllers/profilePage.client.controller");
require("./directives/profilePage.client.directive");