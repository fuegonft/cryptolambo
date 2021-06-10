<?php error_reporting(E_ALL); ini_set('display_errors',1);
include 'config.php';
//get latest timestamp from roll table
$stmt = $conn->prepare("SELECT max(block_number) block FROM trades"); 
$stmt->execute();
$fundtx = $stmt->fetchAll();
$fundtx[0]['block'];
if($fundtx[0]['block']!=0){
    $block = $fundtx[0]['block'];
}else{
    $block = 0;
}

//this function will fetch and process data of ALL events
function fetchData($conn, $fromBlock){
        
    if ($fromBlock !== null)
    {
		$fromBlock = $fromBlock;
    }else{
    	$fromBlock = 0;
    }
	
    echo $url = BSCSCAN_EVENT_URL."&fromBlock=".$fromBlock."&toBlock=latest&address=".TRADING_CONTRACT_ADDRESS."&apikey=".API_KEY;
    $ch = curl_init();
    
    curl_setopt($ch, CURLOPT_URL,$url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    
    $output = curl_exec($ch);
    $output = json_decode($output);
    curl_close ($ch);
    //print_r($output);
    //exit;
    $last = null;
    if($output->message=='OK'){
        $result = $output->result;
    foreach ($result as $key => $value) {
    	
    	 $eventName = $value->topics[0];
         if($eventName==TRADE){
            $last = $value;
            $data = $value->data;
            $blockNumber = substr($value->blockNumber,2);
            $blockNumber = hexdec($blockNumber);
            $timeStamp = substr($value->timeStamp,2);
            $timeStamp = hexdec($timeStamp);
            $transaction_id = $value->transactionHash;
            
            
            $seller = '0x'.substr($value->topics[1],26); 
            $buyer = '0x'.substr($value->topics[2],26); 
            $tokenID = $value->topics[3];
            $tokenID = hexdec($tokenID);

            $price = hexdec(substr($data,0,66));
            $price = $price/1e18;
            $fee = hexdec(substr($data,66,64));
            $fee = $fee/1e18;
            $orderID = hexdec(substr($data,130,64));

            $count = $conn->query("SELECT count(*) FROM trades where order_id=".$orderID." AND transaction_id='".$transaction_id."' AND seller='".$seller."' AND buyer='".$buyer."' AND tokenid=".$tokenID." AND price=".$price."  AND fee=".$fee." AND block_number=".$blockNumber." AND timestamp=".$timeStamp)->fetchColumn(); 
                if($count==0){
                    $sqlInsert = "INSERT INTO trades(order_id,transaction_id,seller,buyer,tokenid,price,fee,block_number,timestamp) values(".$orderID.",'".$transaction_id."','".$seller."','".$buyer."',".$tokenID.",".$price.",".$fee.",".$blockNumber.",".$timeStamp.")";
                    $conn->exec($sqlInsert);

                    $sqlUpdate = "UPDATE orders set order_status='COMPLETED' where order_id=".$orderID." AND seller='".$seller."' AND tokenid=".$tokenID." AND price=".$price." AND order_status='ACTIVE'";
                    $conn->exec($sqlUpdate);
                }
        }       	
    }
}
    
    return $last;
}
    for($i=0; $i<10; $i++){
        $lastEvent = fetchData($conn, $block);
        echo "Fetched 200 up to timestamp ".$block."<br/>";
        usleep(250*1000);
        $lastEvent = fetchData($conn, $block);
        echo "Fetched 200 more up to fingerprint ".$block."<br/>";
        flush();
        sleep(4);
    }

?>