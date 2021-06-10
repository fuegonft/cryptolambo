$(document).ready(function(){
    connectAccount();
    function connectAccount() {
        if (window.ethereum) {
            window.ethereum.enable();
        }
    }
    
        
        displayNFTs();
        
        //staked bnfy nft balance in contract
        async function displayNFTs(){
            var divContent = "";
            const fetchResponse =  await fetch(`api/nftOrdersList.php`);
            const data = await fetchResponse.json();     
            
            if(data.result==true){
                const orders = data.orders;
                if(orders.length>0){
                    orders.forEach(async element => {
                        const price = element.price;
                        //element.seller;
                        const tokenID = element.tokenid;
                        
                        const fetchResponse2 =  await fetch(NFT_URI+tokenID);
                        var data2 = await fetchResponse2.json();   
                        divContent +='<div class="col-lg-4 col-md-6">'+
                            '<div class="team-wrapper">'+
                                '<div class="team-thumb">'+
                                    '<img src="'+data2.image+'" alt="CryptoLambo">'+
                                '</div>'+
                                '<div class="team-content">'+
                                    '<h4 class="title">'+
                                        '<a href="nft.php?id='+tokenID+'">Crypto Lambo</a>'+
                                    '</h4>'+
                                    '<span class="info">'+price+' $LAMBO</span>'+
                                '</div>'+
                            '</div>'+
                        '</div>';
                  
                    });
                 
                    
                }else{
                    divContent = 'No $LAMBO NFTs for sale in the dealership.';
                }

            } else{
                divContent = 'No $LAMBO NFTs for sale in the dealership.';
            }
                 await sleep(3000);
                 $('#marketsDiv').html(divContent);
               
            }
       
    });
