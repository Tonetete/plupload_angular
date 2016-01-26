'use strict';

describe('Controller: FilesuploadCtrl', function () {

  // load the controller's module
  beforeEach(module('puploadAngularApp'));

  var FilesuploadCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    FilesuploadCtrl = $controller('FilesuploadCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(FilesuploadCtrl.awesomeThings.length).toBe(3);
  });
});
