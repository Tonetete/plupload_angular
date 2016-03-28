'use strict';

angular.module('puploadAngularApp')
        .constant("baseURL","http://localhost/uploads/")
        .service('uploadFactory', ['$resource', 'baseURL',
         function($resource, baseURL) {

           this.getFiles = function(){
             return $resource(baseURL+"upload/:id",{id:'@id'},{
               'update': {method:'PUT'} // method for issue a update request
             },
             {
                stripTrailingSlashes: false
             });
           }

        }])
;
