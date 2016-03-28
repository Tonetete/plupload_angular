<?php
/**
 * Created by PhpStorm.
 * User: Tone
 * Date: 5/3/16
 * Time: 13:07
 */


class MongoConnection {

    private $manager;
    private $bulk;
    private $collection;


    function initConnection($collection){

        $this->manager = new MongoDB\Driver\Manager("mongodb://localhost:27017");
        $this->collection = $collection;

    }

    function getManager(){
        return $this->manager;
    }

    function insertOperation($datas){

        $this->bulk = new MongoDB\Driver\BulkWrite(['ordered' => true]);

        foreach($datas as $data) {
           $this->bulk->insert($data);
        }

        $writeConcern = new MongoDB\Driver\WriteConcern(MongoDB\Driver\WriteConcern::MAJORITY, 1000);

        try {
            $result = $this->manager->executeBulkWrite($this->collection, $this->bulk, $writeConcern);
        } catch (MongoDB\Driver\Exception\BulkWriteException $e) {
            $result = $e->getWriteResult();

            // Check if the write concern could not be fulfilled
            if ($writeConcernError = $result->getWriteConcernError()) {
                printf("%s (%d): %s\n",
                    $writeConcernError->getMessage(),
                    $writeConcernError->getCode(),
                    var_export($writeConcernError->getInfo(), true)
                );
            }

            // Check if any write operations did not complete at all
            foreach ($result->getWriteErrors() as $writeError) {
                printf("Operation#%d: %s (%d)\n",
                    $writeError->getIndex(),
                    $writeError->getMessage(),
                    $writeError->getCode()
                );
            }
        } catch (MongoDB\Driver\Exception\Exception $e) {
            printf("Other error: %s\n", $e->getMessage());
            exit;
        }

        return $result->getInsertedCount();
    }

    function updateOperation($data){

        $this->bulk = new MongoDB\Driver\BulkWrite();
        $this->bulk->update(
                ['_id' => $data->id],
                ['$set'=> ['name' => $data->name, 'url' => $data->url]],
                ['multi' => false, 'upsert' => false]
        );

        $writeConcern = new MongoDB\Driver\WriteConcern(MongoDB\Driver\WriteConcern::MAJORITY, 1000);

        try {
            $result = $this->manager->executeBulkWrite($this->collection, $this->bulk, $writeConcern);
        } catch (MongoDB\Driver\Exception\BulkWriteException $e) {
            $result = $e->getWriteResult();

            // Check if the write concern could not be fulfilled
            if ($writeConcernError = $result->getWriteConcernError()) {
                printf("%s (%d): %s\n",
                    $writeConcernError->getMessage(),
                    $writeConcernError->getCode(),
                    var_export($writeConcernError->getInfo(), true)
                );
            }

            // Check if any write operations did not complete at all
            foreach ($result->getWriteErrors() as $writeError) {
                printf("Operation#%d: %s (%d)\n",
                    $writeError->getIndex(),
                    $writeError->getMessage(),
                    $writeError->getCode()
                );
            }
        } catch (MongoDB\Driver\Exception\Exception $e) {
            printf("Other error: %s\n", $e->getMessage());
            exit;
        }

        return $result->getModifiedCount();
    }

    function deleteOperation($datas){

        $this->bulk = new MongoDB\Driver\BulkWrite(['ordered' => true]);

        foreach($datas as $id){
            $this->bulk->delete(["_id" => $id], ['limit' => 1]);
        }

        $writeConcern = new MongoDB\Driver\WriteConcern(MongoDB\Driver\WriteConcern::MAJORITY, 1000);

        try {
            $result = $this->manager->executeBulkWrite($this->collection, $this->bulk, $writeConcern);
        } catch (MongoDB\Driver\Exception\BulkWriteException $e) {
            $result = $e->getWriteResult();

            // Check if the write concern could not be fulfilled
            if ($writeConcernError = $result->getWriteConcernError()) {
                printf("%s (%d): %s\n",
                    $writeConcernError->getMessage(),
                    $writeConcernError->getCode(),
                    var_export($writeConcernError->getInfo(), true)
                );
            }

            // Check if any write operations did not complete at all
            foreach ($result->getWriteErrors() as $writeError) {
                printf("Operation#%d: %s (%d)\n",
                    $writeError->getIndex(),
                    $writeError->getMessage(),
                    $writeError->getCode()
                );
            }
        } catch (MongoDB\Driver\Exception\Exception $e) {
            printf("Other error: %s\n", $e->getMessage());
            exit;
        }

        return $result->getDeletedCount();
    }

    function queryOperationById($id){
        $filter = ['_id' => $id];
        $query = new MongoDB\Driver\Query($filter);
        $cursor = $this->manager->executeQuery($this->collection, $query);
        $row = $cursor->toArray();

        if(sizeof($row) > 0){
            return $row[0];
        }
        else{
            return null;
        }

    }

    function queryOperation(){
        $query = new MongoDB\Driver\Query([]);
        $cursor = $this->manager->executeQuery($this->collection, $query);
        $rows =  $cursor->toArray();

        if(sizeof($rows) > 0){
            return $rows;
        }
        else{
            return null;
        }
    }
}

