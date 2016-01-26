'use strict';

/**
 * @ngdoc overview
 * @name puploadAngularApp
 * @description
 * # puploadAngularApp
 *
 * Main module of the application.
 */
angular
  .module('puploadAngularApp', [
    'ngResource',
    'ngRoute'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/filesupload.html',
        controller: 'FilesuploadCtrl', // If you define here the controller, its not necessary call it in the view.
                                       // If you define both sides cause the controller call twice, so take it in mind!
                                       // http://stackoverflow.com/questions/14442954/angularjs-controller-is-called-twice-by-using-routeprovider
        controllerAs: 'filesUpload'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
