<?php error_reporting(E_ALL);
include_once '../cron/config.php';
$qry = $conn->query("SELECT * FROM orders where order_status='ACTIVE' order by timestamp DESC")->fetchAll();
    if(count($qry)>0){
        $orders = [];
        foreach($qry as $res){
            $price=$res['price'];
        
            $order = array(
                        'price'=>$price,
                        'seller'=>$res['seller'],
                        'tokenid'=>$res['tokenid']);
            array_push($orders,$order);
        
        }
        $result['result']= true;
        $result['msg'] = 'ok';
        $result['orders']= $orders;
        echo json_encode($result);
        exit();	
    }else{
        $result['result']= false;
        $result['msg'] = 'Currently No Tokens Listed for Sale.';
        echo json_encode($result);
        exit();	
    }