'use strict';

/**
 * @ngdoc function
 * @name puploadAngularApp.controller:FilesuploadCtrl
 * @description
 * # FilesuploadCtrl
 * Controller of the puploadAngularApp
 */
angular.module('puploadAngularApp')
  .controller('FilesuploadCtrl', ['$scope', 'uploadFactory','$timeout',
    function ($scope, uploadFactory, $timeout) {
    $scope.filesUploads = [];
    $scope.filesUploaded = [];
    $scope.succesUpdated = false;
    $scope.notFilesUploaded = false;
    $scope.uploader = new plupload.Uploader({
     runtimes : 'html5,flash,silverlight,html4',
     browse_button : 'pickfiles', // you can pass an id...
     container: document.getElementById('container'), // ... or DOM Element itself
     url : 'http://localhost/uploads/upload/',
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
           file.showError = false;
           file.processingFile = false;
           file.complete = false;
           $scope.filesUploads.push(file);
           $scope.$apply(); // probably plupload is blocking the scope apply event so we have to aply ourselves.

           // Set preview image
           var img = new mOxie.Image();
        		img.onload = function() {
                this.embed($('#preview-'+file.id).get(0), {
                  width: 100,
                  height: 100,
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
              $('#preview-'+file.id).prepend('<span style="font-size: 100px; color: #fff;"><i class="glyphicon glyphicon-file"></i></span>');
            }
         });
       },

       BeforeUpload: function(up, file) {
         file.showProgress = true;
         file.showError = false;
       },

       UploadProgress: function(up, file) {
         file.progressFile = file.percent;
         file.processingFile = false;
         if(file.percent === 100){
           file.processingFile = true;
         }
         $scope.$apply();
       },

       FileUploaded: function(up, file, response) {
         response.response = $.parseJSON(response.response);
         console.log("File uploaded: "+file.name);
         console.log("Response from the server: "+response.message+ " with status: "+ response.status);
         console.log("Response headers: "+response.responseHeaders);
         file.processingFile = false;
         file.complete = true;
         $scope.filesUploaded.push(response.response.row);
         $scope.notFilesUploaded = false;
         $scope.$apply();
       },

       Error: function(up, err) {
         err.file.error = err.response+" with status: "+err.status;
         err.file.showError = true;
         err.file.showProgress = false;
         err.file.processingFile = false;
         err.file.complete = false;
         $scope.$apply();
         console.log(err.file.name+" showError: "+err.file.showError);
         console.log("Error Plupload code#" + err.code + ": " + err.message);
         console.log("Error with file: "+err.file.name);
         console.log("Response from the server: "+err.response.message+" with status: "+err.status);
         console.log("Response headers: "+err.responseHeaders);
       }
     }
   });

   $scope.formatSize = function(size){
     return plupload.formatSize(size);
   }

   /**
    * @ngdoc function
    * @name deleteFile
    * @description
    *
    * Function to delete a file passing its id.
    */

   $scope.deleteFile = function(id1){

    uploadFactory.getFiles().delete({id: id1})
     .$promise.then(
       function(response){
         var index = $scope.filesUploaded.indexOfObject("_id",response.row._id);
         $scope.filesUploaded.splice(index, 1);
         console.log("delete success!");
       },
       function(error){
         console.log("delete error! "+error);
       }
     );

   }

   Array.prototype.indexOfObject = function arrayObjectIndexOf(property, value) {
    for (var i = 0, len = this.length; i < len; i++) {
        if (this[i][property] === value) return i;
     }
     return -1;
   }

   /**
    * @ngdoc function
    * @name updateNameFile
    * @description
    *
    * Function to update a file name passing its id.
    */

   $scope.updateNameFile = function(id, data){
     uploadFactory.getFiles().update({id: id, name: data})
      .$promise.then(
        function(response){
            console.log("update success!");
            console.log(response);
            $scope.succesUpdated = true;
            var index = $scope.filesUploaded.indexOfObject("_id",id);
            $scope.filesUploaded[index].succesUpdated = true;
            $timeout(function(){
              $scope.filesUploaded[index].succesUpdated = false;
            }, 3000);
        },
        function(error){
          console.log("update error! "+error);
        });

   };


   $scope.uploader.init();

   // initial load
   $scope.init = function(){
     uploadFactory.getFiles().query().$promise
     .then(function(response){
            $scope.notFilesUploaded = false;
            $scope.filesUploaded = response;
            console.log(response);
          },
          function(error){
            if(error.status === 404){
              $scope.notFilesUploaded = true;
            }
            console.log(error);
          });
   }

   $scope.init();

  }])
  /*.filter('trusted', ['$sce', function ($sce) {
    return function(url) {
        return $sce.trustAsResourceUrl(url);
    };
  }]);*/;
