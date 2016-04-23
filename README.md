# plupload_angular

A fancy uploader developed with angularjs and plupload.


For issues with max file size allowed in PHP, edit the php.ini file and set directive upload_max_filesize whatever the value you want to.

Also is necessary add the post_max_size directive:

Sets max size of post data allowed. This setting also affects file upload. To upload large files, this value must be larger than upload_max_filesize. Generally speaking, memory_limit should be larger than post_max_size. When an integer is used, the value is measured in bytes. Shorthand notation, as described in this FAQ, may also be used. If the size of post data is greater than post_max_size, the $_POST and $_FILES superglobals are empty. This can be tracked in various ways, e.g. by passing the $_GET variable to the script processing the data, i.e. <form action="edit.php?processed=1">, and then checking if $_GET['processed'] is set.

For more info about this directives check this link http://php.net/manual/es/ini.core.php and this one http://www.plupload.com/punbb/viewtopic.php?pid=5221#p5221

For more infor about POSTH method uploads in PHP: http://www.php.net/manual/en/features.file-upload.post-method.php#example-354


There is an object list for files that are uploading and another for upload files.
