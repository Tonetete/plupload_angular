'use strict';

/**
 * @ngdoc function
 * @name puploadAngularApp.controller:FilesuploadCtrl
 * @description
 * # FilesuploadCtrl
 * Controller of the puploadAngularApp
 */
angular.module('puploadAngularApp')
  .controller('FilesuploadCtrl', ['$scope', function ($scope) {
    $scope.showProgress = false; // show progres bar
    $scope.filesUploads = [];

    $scope.uploader = new plupload.Uploader({
     runtimes : 'html5,flash,silverlight,html4',
     browse_button : 'pickfiles', // you can pass an id...
     container: document.getElementById('container'), // ... or DOM Element itself
     url : 'http://localhost/uploads/upload.php',
     flash_swf_url : '../js/Moxie.swf',
     silverlight_xap_url : '../js/Moxie.xap',

     chunk_size: '5000kb',

     filters : {
       max_file_size : '10000mb',
       mime_types: [
         {title : "Image files", extensions : "jpg,gif,png"},
         {title : "Zip files", extensions : "avi,mp4,wmv,zip"},
         {title : "PDF files", extensions : "pdf"}
       ]
     },
     headers: {
         'Access-Control-Allow-Origin' : 'http://localhost:9000/'
     },

     init: {
       PostInit: function() {
         //document.getElementById('filelist').innerHTML = '';
         $scope.uploadFiles = function(){
           $scope.uploader.start();
           $scope.showProgress=true;
           return false;
         };
       },

       FilesAdded: function(up, files) {
         plupload.each(files, function(file) {
           file.size = plupload.formatSize(file.size);
           $scope.filesUploads.push(file);
           $scope.$apply(); // probably plupload is blocking the scope apply event so we have to aply ourselves.
           console.log(file);
           //document.getElementById('filelist').innerHTML += '<div id="' + file.id + '">' + file.name + ' (' + plupload.formatSize(file.size) + ') <b></b></div>';
         });
       },
       QueueChanged: function(up){
         console.log(up);
       },

       UploadProgress: function(up, file) {
         $scope.progressFile = file.percent;
         //document.getElementById(file.id).getElementsByTagName('b')[0].innerHTML = '<span>' + file.percent + "%</span>";
       },

       Error: function(up, err) {
         console.log("Error #" + err.code + ": " + err.message);
         console.log(err);
         //document.getElementById('console').appendChild(document.createTextNode("\nError #" + err.code + ": " + err.message));
       }
     }
   });

   $scope.uploader.init();
  }]);
