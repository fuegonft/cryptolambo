$(document).ready(function(){
    connectAccount();
    function connectAccount() {
        if (window.ethereum) {
            window.ethereum.enable();
        }
    }
    
        function init(){                
            displayNFTsV2();
        }
        setTimeout(init,2000);
        async function displayNFTsV2(){
            $('#userNFTS').html('');
            divContent = '';
          //  myAccountAddress = '0xF43A020356D7463042150D4A67356761B71bd470';
            var assetIn =[];
            const url = 'https://api.bscscan.com/api?module=account&action=tokennfttx&address='+myAccountAddress+'&contractaddress='+contractAddress+'&startblock=0&endblock=latest&sort=asc&apiKey='+API_KEY;
            
            const fetchResponse3 =  await fetch(url);
            const data3 = await fetchResponse3.json();     
            if(data3.message=='OK'){
                const result = data3.result;
                if(result.length>0){
                    result.forEach(element => {
                        const from = element.from;
                        const to = element.to;
                        const contract_Address = element.contractAddress;
                        const tokenID = element.tokenID;
                        const tokenName = element.tokenName;
                        const tokenSymbol = element.tokenSymbol;
                            const index = contract_Address+'@'+tokenID;
                            const asset = {'index' : index,
                                            'owner' : to,
                                            'contractAddress':contract_Address,
                                            'tokenID': tokenID,
                                            'tokenName': tokenName,
                                            'tokenSymbol' : tokenSymbol};
                                
                            if(to.toLowerCase()===myAccountAddress.toLowerCase()){
                                assetIn.push(asset);   
                            }
                            if(from.toLowerCase()===myAccountAddress.toLowerCase()){
                                for(var j=0;j<assetIn.length;j++){
                                    const cntAd = assetIn[j]['contractAddress'];
                                    const cntTk = assetIn[j]['tokenID'];
                                    if(cntAd==contract_Address && cntTk==tokenID){
                                        const aIndex = assetIn[j]['index'];
                                        assetIn.splice(j, 1);
                                    }
                                }
                            }
                        
                    });
                    
                }

            }
            await sleep(100);
         
            
            for(var i=0;i<assetIn.length;i++){
                
                const owner = assetIn[i]['owner'];
                if(owner.toLowerCase()==myAccountAddress.toLowerCase()){
                    try{
                        var tokenURI = await contractInstance.methods.tokenURI( assetIn[i]['tokenID']).call();
                    }catch(error){
                        console.log(error);
                        continue;
                    }
                    
                    if(tokenURI!=""){
                        var requestOptions = {
                            method: 'GET',
                            redirect: 'follow'
                        };

                        await fetch(tokenURI, requestOptions)
                        .then(response => response.text())
                        //.then(result => console.log(result))
                        .then(result => {
                            const result2 = JSON.parse(result); 
                            //const tokenName2 =result2['name'];  
                            //const description2 =result2['description'];  
                            var image2 =result2['image'];  
                           
                            divContent ='<div class="col-lg-4 col-md-6">'+
                            '<div class="team-wrapper">'+
                                '<div class="team-thumb">'+
                                    '<img src="'+image2+'" alt="Crypto Lambos">'+
                                '</div>'+
                                '<div class="team-content">'+
                                    '<h4 class="title">'+
                                        '<a href="nft.php?id='+assetIn[i]['tokenID']+'">Crypto Lambo</a>'+
                                    '</h4>'+
                                    //'<span class="info">NFT Price</span>'+
                                '</div>'+
                            '</div>'+
                        '</div>';
                        $('#userNFTS').append(divContent);  
                        } )
                        .catch(error => console.log('error', error));                      
                    }
                        
                }
            }
           
           
        }       
});