$(document).ready(function(){
    //connect to metamask wallet 
    $("#connectWallet").click(async function(e){
        e.preventDefault();
        if(window.ethereum){
            ethereum.enable();
            const accounts_ = await ethereum.request({ method: 'eth_accounts' });
            if(accounts_!=""){
                window.location.href = "";
            }
        }
    });
    function init(){
                
        contractInstance = new myweb3.eth.Contract(ABI, contractAddress, {
                from: myAccountAddress, // default from address
        });
    }
    setTimeout(init,2000);
    $(document).on("click", ".mintBapes",async function(e){
        e.preventDefault();
        var numberOfTokens = $(this).data('tokens');
        var tokenPrice = 1*1e18;
        var gasLimit = 500000;
        if(numberOfTokens==1){
            gasLimit = 500000;
        }else if(numberOfTokens==5){
            gasLimit = 1000000;
        }else if(numberOfTokens==10){
            gasLimit = 2000000;
        }else if(numberOfTokens==20){
            gasLimit = 3000000;
        }else{
            gasLimit = 500000;
        }
        var payableAmount = tokenPrice *  numberOfTokens;
        var result = await contractInstance.methods.mintLambo(numberOfTokens).send({
            from: myAccountAddress,
            to: contractAddress,
            gasPrice: 5000000000,
            gasLimit: gasLimit,
            value : payableAmount,       
        });

        if(result){
            swal("Success !", "Successfully Minted Lambos.", "success");
            //alert('Successfully Minted Lambos.');
        }

    });
    
});