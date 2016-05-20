# plupload_angular

`A fancy uploader developed with angularjs and plupload.`

This project is about a file uploader made with AngularJS as the front-end and PHP & MongoDB for the backend and logic data respectively.

## Requirements

1. You need to run in local a mongod instance, preferably in 27017.
2. Have a web server which can run PHP scripts either Apache or Nginx will be fine.

## Instructions

1. Run `grunt server`in project folder.
2. Run your mongod instance with `mongod`
3. Move `rest_upload.php`and `mongo-connection.php`to an folder called `upload` inside your www folder.
4. Run your web server.
5. Access `http://localhost:9000``
6. Enjoy!

For more info about this project you can refer to my blog site, in spanish: http://www.laguaridadetone.com/gestor-de-descargas-con-angularjs-y-servicios-rest-1o-creando-la-vista-con-angularjs/


## Troubleshoot

For issues with max file size allowed in PHP, edit the php.ini file and set directive `upload_max_filesize` whatever the value you want to. Also is necessary add the `post_max_size directive`. For more info about this directives check this link http://php.net/manual/es/ini.core.php and this one http://www.plupload.com/punbb/viewtopic.php?pid=5221#p5221
