<?php error_reporting(E_ALL);
include_once '../cron/config.php';

if(isset($_GET['tokenID'])){
    $tokenID = $_GET['tokenID'];
    $qry = $conn->query("SELECT order_id,price,seller FROM orders where tokenid=$tokenID AND order_status='ACTIVE'")->fetchAll();
    if(count($qry)==1){
        $price=$qry[0]['price'];
        $seller=$qry[0]['seller'];
        $orderID = $qry[0]['order_id'];
        $orderID = $qry[0]['order_id'];
        $result['orderID']= $orderID;
        $result['price']= $price;
        $result['seller']= $seller;
        $result['result']= true;
        $result['msg'] = 'ok';
        echo json_encode($result);
        exit();	
    }else{
        $result['result']= false;
        $result['msg'] = 'No Tokens Found.';
        echo json_encode($result);
        exit();	
    }
}else{
    $result['result']= false;
    $result['msg'] = 'Invalid Token ID';
    echo json_encode($result);
    exit();	
}

