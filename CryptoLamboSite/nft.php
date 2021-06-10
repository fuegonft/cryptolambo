<?php include_once 'header.php'; ?> 
    <!--============= Advance Feature Section Starts Here =============-->
    <section class="advance-feature-section padding-bottom padding-top-2">
        <div class="container">
            <div class="advance-feature-item padding-top-2">
                <div class="advance-feature-thumb">
                   <img id="product-image" src="" alt="Loading....">
                </div>
                <div class="advance-feature-content">
                    <div class="section-header left-style mb-olpo">
                        <h2 class="title" id="product-name">Crypto Lambo</h2>
                        <p id="product-description">NFT Description.</p>
                        <h5 class="cate" id="product-price"></h5>
                    </div>
                    <input type="hidden" id="tokenPrice" value="0">
                    <input type="hidden" id="orderID" value="0">
                    <input type="hidden" id="tokenID" value="0">
                            
                    <a href="#" id="btnBuyNow" class="get-button" style="display:none;">BUY NFT </a>
                    <input type="text" id="sellPrice" class="banner-search-form" style="width: 100px;display:none;" value="">
                     <a href="#" id="btnSellNFT" class="get-button" style="display:none ;">Sell</a>
                    <a href="#" id="btnsetPriceNFT" class="get-button" style="display:none ;">Change Price</a>
                    <a href="#" id="btnCancelNFT" class="get-button" style="display:none ;">Cancel</a>
                </div>
            </div>
            </div>
        </div>
    </section>
    <!--============= Advance Feature Section Ends Here =============-->
<?php include_once 'footer.php'; ?> 
<script src="./assets/js/nft.js"></script>