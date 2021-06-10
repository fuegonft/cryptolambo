<?php
error_reporting(E_ALL); ini_set('disply_errors', 1);

$result = [];

//if(isset($_GET['id']) && $_GET['id']!=0){
if(isset($_GET['id'])){
    $tokenID = $_GET['id'];
    $result['name']     = "Crypto Lambo";
    $result['image']    = "https://cryptolambo.net/assets/images/greenhuracanrotate.gif";
    $result['description']     = "June 2021 Drawing";
    header("Content-type:application/json");
    http_response_code(200); 
    echo json_encode($result);
}else{
     http_response_code(404); 
}


?>