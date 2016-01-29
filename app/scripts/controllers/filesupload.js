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
    $scope.filesUploads = [];
    $scope.uploader = new plupload.Uploader({
     runtimes : 'html5,flash,silverlight,html4',
     browse_button : 'pickfiles', // you can pass an id...
     container: document.getElementById('container'), // ... or DOM Element itself
     url : 'example.php',
     flash_swf_url : '../plupload/Moxie.swf',
     silverlight_xap_url : '../plupload/Moxie.xap',

     //chunk_size: '50000kb',

     filters : {
       max_file_size : '10000mb',
       mime_types: [
         {title : "Image files", extensions : "jpg,gif,png"},
         {title : "Zip files", extensions : "zip"},
         {title : "Video files", extensions : "avi,mp4,wmv,mkv"},
         {title : "PDF files", extensions : "pdf"}
       ]
     },
     headers: {
         'Access-Control-Allow-Origin' : 'http://localhost:9000/'
     },

     init: {
       PostInit: function() {
         $scope.uploadFiles = function(){
           $scope.uploader.start();
           return false;
         };
       },

       FilesAdded: function(up, files) {
         plupload.each(files, function(file) {
           file.formatSize = plupload.formatSize(file.size);
           file.progress = 0;
           file.showProgress = false;
           file.processingFile = false;
           $scope.filesUploads.push(file);
           $scope.$apply(); // probably plupload is blocking the scope apply event so we have to aply ourselves.

           // Set preview image
           var img = new mOxie.Image();
        		img.onload = function() {
                this.embed($('#preview-'+file.id).get(0), {
                  width: 150,
                  height: 150,
                  crop: true
                });
        		};
        		img.onembedded = function() {
        			this.destroy();
        		};
        		img.onerror = function() {
        			this.destroy();
        		};
            if(file.type === 'image/jpeg' || file.type === 'image/png'){
                img.load(file.getSource());
            }
            else{
              $('#preview-'+file.id).prepend('<span style="font-size: 150px; color: #fff;"><i class="glyphicon glyphicon-file"></i></span>')
            }
         });
       },

       BeforeUpload: function(up, file) {
         file.showProgress = true;
       },

       UploadProgress: function(up, file) {
         file.progressFile = file.percent;
         file.processingFile = false;
         $scope.$apply();
       },

       FileUploaded: function(up, file, response) {
         console.log("File uploaded: "+file.name);
         console.log("Response from the server: "+response.response+ " with status: "+ response.status);
         console.log("Response headers: "+response.responseHeaders);
       },

       Error: function(up, err) {
         console.log("Error Plupload code#" + err.code + ": " + err.message);
         console.log("Error with file: "+err.file.name);
         console.log("Response from the server: "+err.response+" with status: "+err.status);
         console.log("Response headers: "+err.responseHeaders);
       }
     }
   });

   $scope.uploader.init();


  }]);
