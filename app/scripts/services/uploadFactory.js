'use strict';

angular.module('puploadAngularApp')
        .constant("baseURL","http://localhost/uploads/")
        .service('uploadFactory', ['$resource', 'baseURL',
         function($resource, baseURL) {

           this.getFiles = function(){
             return $resource(baseURL+"upload/:id",{id:'@id'},{
               'update': {method:'PUT'}, // method for issue a update request
               'query': {
                    method: 'GET',
                    transformResponse: function (data) {
                      data = $.parseJSON(data);
                      if(data.status===200){
                          return data.rows;
                      }
                      else{
                        console.log(data.status+" -> "+data.message);
                        return undefined;
                      }

                    },
                    isArray: true //since your list property is an array
                }
             },
             {
                stripTrailingSlashes: false
             });
           }

        }])
;
