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
    $scope.idx = 0; // for indexing the files
    $scope.uploader = new plupload.Uploader({
     runtimes : 'html5,flash,silverlight,html4',
     browse_button : 'pickfiles', // you can pass an id...
     container: document.getElementById('container'), // ... or DOM Element itself
     url : 'http://localhost/uploads/upload.php',
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
         //document.getElementById('filelist').innerHTML = '';
         $scope.uploadFiles = function(){
           $scope.uploader.start();
           return false;
         };
       },

       FilesAdded: function(up, files) {
         plupload.each(files, function(file) {
           var filecito = file.getSource();
           file.formatSize = plupload.formatSize(file.size);
           file.progress = 0;
           file.idx = $scope.idx;
           file.showProgress = false;
           file.processingFile = false;
           $scope.filesUploads.push(file);
           $scope.idx++;
           $scope.$apply(); // probably plupload is blocking the scope apply event so we have to aply ourselves.
           //console.log(file);

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
         $scope.filesUploads[file.idx].progressFile = file.percent;
         file.processingFile = false;
         $scope.$apply();
       },

       FileUploaded: function(up, file, response) {
         console.log("File uploaded: "+file.name);
       },

       Error: function(up, err) {
         console.log("Error #" + err.code + ": " + err.message);
         //document.getElementById('console').appendChild(document.createTextNode("\nError #" + err.code + ": " + err.message));
       }
     }
   });

   $scope.uploader.init();

   // function for search a file in json array by its id
   $scope.findFile = function(id) {
        var i = 0;
        angular.forEach($scope.filesUploads, function(value) {
            if (value.id === id)
              return i;
            else
              i++;
        });
    };

  }]);
