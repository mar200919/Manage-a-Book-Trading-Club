/*global angular*/

//exports module
module.exports = angular.module('BookPagesModule',[]);

// require all controllers, services, directives
require("./services/books.client.service");
require("./controllers/allBooksPage.client.controller");
require("./directives/bookPages.client.directive");