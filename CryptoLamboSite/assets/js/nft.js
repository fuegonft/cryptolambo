$(document).ready(function(){
    connectAccount();
    function connectAccount() {
        if (window.ethereum) {
            window.ethereum.enable();
        }
    }
    var TradingContractInstance,WBNBContractInstance;
//     If owner:
// 1. The "buy now" button should show as "Sell NFT" and 
//the price should be 0 or not visible until the owner puts it for sale. 
// 2. If the owner already put the NFT for sale, then the button should show as "Cancel"
// and the price would show as what they set it. 

// If not owner:
// 3. If the NFT is for sale then the button would show as "Buy Now" and the price will be visible. 
// 4. If the NFT is not for sale then the Button and price will not be visible.

    var tokenID = '';
	$.urlParam = function(name){
        var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
        return results[1] || 0;
    };

	if (window.location.href.indexOf('?id=') > 0) {
        if($.urlParam('id')!=''){
            tokenID =$.urlParam('id');
        }
    }

        function init(){
            TradingContractInstance = new myweb3.eth.Contract(TradingABI, TradingContractAddress, {
                from: myAccountAddress, // default from address
            });
            WBNBContractInstance = new myweb3.eth.Contract(WBNB_ABI, WBNB_contractAddress, {
                from: myAccountAddress, // default from address
            });
            displayNFTs();
        }
        setTimeout(init,2000);
        //staked bnfy nft balance in contract
        async function displayNFTs(){
            var divContent = '';
            const fetchResponse =  await fetch(NFT_URI+tokenID);
            const data = await fetchResponse.json();     
            //$('#product-title').html(data.name);
            $('#product-image').attr('src',data.image);
            $('#product-description').html(data.description);
            $('#tokenID').val(tokenID);
            
            
            // data.attributes.forEach(element => {
            //     divContent +='<p>'+element.trait_type+' : '+element.value+'</p><p></p>';
                
            // });
            $('#product-attributes').html(divContent);
            var owner = await contractInstance.methods.ownerOf(tokenID).call();
            $('#owner').html(getUserAddress(owner));
            $('#owner').attr('href',bscscanAddressURL+owner).attr('target','_blank');

            const fetchResponseT =  await fetch(`api/nftTradeDetails.php?tokenID=`+tokenID);
            const dataT = await fetchResponseT.json();  
            if(dataT.result==true){
                $('#product-price').html(dataT.price+ ' $LAMBO');
                $('#tokenPrice').val(dataT.price);
                $('#orderID').val(dataT.orderID);
                if(myAccountAddress.toLowerCase() == dataT.seller){
                    $('#btnCancelNFT').show();  
                    $('#btnsetPriceNFT').show();
                    $('#sellPrice').show();
                }else{
                    $('#product-price').show();
                    $('#btnBuyNow').show();
                }
            }else{
                //check if not in orders then who is owner and display buttons 
                //const owner = await BNFYstakingNFTContractInstance.methods.ownerOf(tokenID).call();
              
                if(myAccountAddress.toLowerCase()==owner.toLowerCase()){
                    $('#sellPrice').show();
                    $('#btnSellNFT').show();   
                }
            }
        }

        $('#btnSellNFT').click(async function(e){
            e.preventDefault();
            var sellPrice = $('#sellPrice').val();
            if(sellPrice=="" || parseFloat(sellPrice)<=0){
                alert("Warning, Please Enter Amount.");
                return false;
            }
           
            sellPrice = sellPrice * 1e18;
            sellPrice = logEtoDecimal(sellPrice, 18);
            //check for approval
            var isApproved = await contractInstance.methods.isApprovedForAll(myAccountAddress,TradingContractAddress).call();
            
            if(isApproved==false){
                var result = await contractInstance.methods.setApprovalForAll(TradingContractAddress,true).send({
                    from: myAccountAddress,
                    to: contractAddress,
                    gasPrice: 5000000000,
                    gasLimit: 500000,
                    //value : 0,       
                });

                try{ 
                    var result = await TradingContractInstance.methods.readyToSellToken(tokenID,sellPrice).send({
                        from: myAccountAddress,
                        to: TradingContractAddress,
                        gasPrice: 5000000000,
                        gasLimit: 500000,
                        //value : 0,       
                    });
                    swal("Success !", "Sell order has been placed.", "success");
                }catch(err){
                    if(err.code==4001){
                        console.log('user canceled');      
                    }
                }
            }else{
                try{ 
                    var result = await TradingContractInstance.methods.readyToSellToken(tokenID,sellPrice).send({
                        from: myAccountAddress,
                        to: TradingContractAddress,
                        gasPrice: 5000000000,
                        gasLimit: 500000,
                        //value : 0,       
                    });

                    swal("Success !", "Sell order has been placed.", "success");
                }catch(err){
                    if(err.code==4001){
                        console.log('user canceled');      
                    }
                }
            }

        });

        $('#btnBuyNow').click(async function(e){
            e.preventDefault();
            var tokenPrice = $('#tokenPrice').val();
            var orderID = $('#orderID').val();
            tokenPrice = parseFloat(tokenPrice);
            var tokenPriceT = tokenPrice;
            tokenPrice = tokenPrice * 1e18;
            var tokenToApprove = 100*1e18;
            var allowance = await WBNBContractInstance.methods.allowance(myAccountAddress,TradingContractAddress).call();
            var balanceOf = await WBNBContractInstance.methods.balanceOf(myAccountAddress).call();
            if(balanceOf<tokenPriceT){
                swal("Warning !", "You don't have enough $LAMBO to buy this NFT.");
                return false;
            }else{
                    if(allowance<tokenPriceT){
                        
                       
                        var result = await WBNBContractInstance.methods.approve(TradingContractAddress,balanceOf).send({
                            from: myAccountAddress,
                            to: contractAddress,
                            gasPrice: 5000000000,
                            gasLimit: 500000,
                            //value : 0,       
                        });
        
                        try{ 
                            var result = await TradingContractInstance.methods.buyToken(tokenID,orderID).send({
                                from: myAccountAddress,
                                to: TradingContractAddress,
                                gasPrice: 5000000000,
                                gasLimit: 500000,
                                //value : 0,       
                            });
                            
                            swal("Success !", "Successfully Purchased Token. Please check your account in 1 min.", "success");
                        }catch(err){
                            if(err.code==4001){
                                console.log('user canceled');      
                            }
                        }
                    }else{
                        try{ 
                            var result = await TradingContractInstance.methods.buyToken(tokenID,orderID).send({
                                from: myAccountAddress,
                                to: TradingContractAddress,
                                gasPrice: 5000000000,
                                gasLimit: 500000,
                                //value : 0,       
                            });
                            console.log(result);
                           swal("Success !", "Successfully Purchased Token. Please check your account in 1 min.", "success");
                        }catch(err){
                            if(err.code==4001){
                                console.log('user canceled');      
                            }
                        }
                    }
            }
            
          
        });

        $('#btnCancelNFT').click(async function(e){
            e.preventDefault();
            const tokenID = $('#tokenID').val();
            var orderID = $('#orderID').val();
            try{ 
                var result = await TradingContractInstance.methods.cancelSellToken(tokenID,orderID).send({
                    from: myAccountAddress,
                    to: TradingContractAddress,
                    gasPrice: 5000000000,
                    gasLimit: 500000,
                    //value : 0,       
                });
                console.log(result);
                swal("Success !", "Successfully Cancelled Token Sale. Please check your account in 1 min.", "success");
            }catch(err){
                if(err.code==4001){
                    console.log('user canceled');      
                }
            }
        });

        $('#btnsetPriceNFT').click(async function(e){
            e.preventDefault();
            const tokenID = $('#tokenID').val();
            var orderID = $('#orderID').val();
            var sellPrice = $('#sellPrice').val();
            
            if(sellPrice=="" || parseFloat(sellPrice)<=0){
                alert("Warning !  Please Enter Amount.");
                return false;
            }
           
            sellPrice = sellPrice * 1e18;
            //sellPrice = sellPrice * Math.pow(10,18);
            sellPrice = logEtoDecimal(sellPrice, 18);
            //console.log(sellPrice);
            //sellPrice = sellPrice.toString();
            try{ 
                var result = await TradingContractInstance.methods.setCurrentPrice(tokenID,sellPrice,orderID).send({
                    from: myAccountAddress,
                    to: TradingContractAddress,
                    gasPrice: 5000000000,
                    gasLimit: 500000,
                    //value : 0,       
                });
                console.log(result);
                swal("Success !", "Successfully Changed Token Sale Price.", "success");
            }catch(err){
                if(err.code==4001){
                    console.log('user canceled');      
                }
            }
        });
        
        function logEtoDecimal(amountInLogE, decimal){
    
              amountInLogE = amountInLogE.toString();
              var noDecimalDigits = "";
            
              if(amountInLogE.includes("e-")){
                
                var splitString = amountInLogE.split("e-"); //split the string from 'e-'
            
                noDecimalDigits = splitString[0].replace(".", ""); //remove decimal point
                var zerosToAdd = splitString[1] - noDecimalDigits.length;
            
                for(var i=0; i < zerosToAdd; i++){
                  noDecimalDigits += "0";
                }
            
                if(splitString[1] < decimal){
                  return noDecimalDigits;
                }
                else{
                  return 0;
                }
              }
              else if(amountInLogE.includes("e+")){
            
                var splitString = amountInLogE.split("e+"); //split the string from 'e+'
            
                noDecimalDigits = splitString[0].replace(".", ""); //remove decimal point
                var zerosToAdd = splitString[1]  - noDecimalDigits.length;
            
                for(var i=0; i <= zerosToAdd; i++){
                  noDecimalDigits += "0";
                }
                return noDecimalDigits;
              }
              return amountInLogE;
            }
       
    });