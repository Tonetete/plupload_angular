<?php
/**
 * Created by PhpStorm.
 * User: Tone
 * Date: 13/2/16
 * Time: 16:42
 */

require_once('mongo-connection.php');

// Turning OFF php report, comment below to debug purposes.
error_reporting(0);
@ini_set('display_errors', 0);

if (isset($_SERVER['HTTP_ORIGIN']) && $_SERVER['HTTP_ORIGIN'] == 'http://localhost:9000') {
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Max-Age: 86400');
}

else{
    return;
}

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {

    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD']))
        header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");

    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']))
        header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");
}


// Set content type headers to json
header("Content-Type: application/json");


// Set target dir
$target_dir = "/Users/Tone/www/uploads/files/";

//Set connection
$connection = new MongoConnection();
$connection->initConnection('db.uploads');

switch($_SERVER['REQUEST_METHOD']){
    case "GET" :
        getRequest();
        break;
    case "POST":
        postRequest();
        break;
    case "PUT":
        updateRequest();
        break;
    case "DELETE":
        deleteRequest();
        break;
    default:
        break;

}

function getRequest(){

    // Set connection
    global $connection;

    // For individual file
    if(isset($_GET['id'])){
        $row = $connection->queryOperationById($_GET['id']);
        if(isset($row)){
            $response['row'] = $row;
            return send_response(200,$response,"Get file ".$row->name." OK");
        }
        else{
            return send_response(404,$response,"Get file with id ".$_GET['id']." NOT FOUND");
        }

    }
    // For query all files
    else{
        $rows = $connection->queryOperation();
        if(isset($rows)){
            $response['rows'] = $rows;
            return send_response(200,$response," GET rows files OK");
        }
        else{
            return send_response(404,$response," GET rows files NOT FOUND");
        }
    }
}

function updateRequest(){

    // Set connection
    global $connection;
    global $target_dir;

    $row = json_decode(file_get_contents("php://input"));

    if(isset($row)){
        $rowOld = $connection->queryOperationById($row->id);
        $url = ($_SERVER['SERVER_NAME']==='localhost') ? 'http://localhost/uploads/files/' : $_SERVER['SERVER_NAME'];
        $row->url = $url . $row->name;
        if($connection->updateOperation($row) > 0){
            rename($target_dir.$rowOld->name, $target_dir.$row->name);
            return send_response(200, $response, " UPDATE file ".$row->name." success!");
        }
        else{
            return send_response(500, $response, "There was an error updating file ".$row->name);
        }
    }
    else{
        return send_response(401, $response, "Bad request.");
    }

}

function deleteRequest(){
    // Set connection
    global $connection;

    // For individual file
    if(isset($_GET['id'])){
        $row = $connection->queryOperationById($_GET['id']);
        if(isset($row)){
            if($connection->deleteOperation($row) > 0){
                // Set target dir
                global $target_dir;
                $target_file = $target_dir . $row->name;
                if (file_exists($target_file)) {
                    unlink($target_file);
                }
                $response['row'] = $row;
                return send_response(200, $response, "File id: ".$row->_id." deleted OK");
            }
            else{
                return send_response(500, $response, "There was an error in server on DELETE file ".$row->name);
            }
        }
        else{
            return send_response(404, $response, "Cannot DELETE file with id ".$_GET['id']." NOT FOUND");
        }

    }
    else{
        return send_response(401, $response, "Bad request.");
    }

}

function postRequest(){

    // Get a file name
    if (isset($_REQUEST["name"])) {
        $fileName = $_REQUEST["name"];
    } elseif (!empty($_FILES)) {
        $fileName = $_FILES["file"]["name"];
    } else {
        $fileName = uniqid("file_");
    }

    // Set target dir
    global $target_dir;
    $target_file = $target_dir . $fileName;
    $uploadOk = 1;


    if (move_uploaded_file($_FILES['file']['tmp_name'], $target_file)) {
        $url = ($_SERVER['SERVER_NAME']==='localhost') ? 'http://localhost/uploads/files/' : $_SERVER['SERVER_NAME'];
        $url = $url . $fileName;
        $datas = array(
            array("_id" => bin2hex(random_bytes(20)), "name" => $fileName, "type" => $_FILES['file']['type'],
                "size" => $_FILES['file']['size'], "url" => $url)
        );

        // Set connection
        global $connection;

        // We have records inserted

        if($connection->insertOperation($datas) > 0){

            // Search for the record
            $row = $connection->queryOperationById($datas[0]['_id']);
            $response['row'] = $row;
            return send_response(200, $response, "Insert file ".$fileName." OK");
        }
        // There was an error inserting the records.
        else{
            return send_response(500, $response, "There was an error inserting the file ".$fileName);
        }

    } else {
        return send_response(500, $response, "There was an error uploading the file.");
    }


}

function send_response($status, $response, $message){
    $response['status'] = $status;
    $response['message'] = $message;
    header("HTTP/1.1 ". $response['status'].": ". $response['message']."");
    echo json_encode($response);
    return;
}