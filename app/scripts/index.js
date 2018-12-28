import {
  default as Web3
} from 'web3';
import {
  default as contract
} from 'truffle-contract'
import art_auction_artifacts from '../../build/contracts/ArtAuction.json'
import '../styles/app.css'

var ArtAuction = contract(art_auction_artifacts);
const ethUtil = require('ethereumjs-util');
//var temp = 0;

const App = {
	start:function(){
		//var self = this;
      var deployed;
    	ArtAuction.setProvider(web3.currentProvider);
     
      ArtAuction.defaults({from:web3.eth.accounts[0]});
     
    ArtAuction.deployed().then(function(i){
      deployed = i;
      console.log("deployed successfully!");
      
    });

    	$("#auction").submit(function(event) {
    		$("#msg").hide();
    		//let sponsorAccount1 = $("#sponsor-account1").val();
        const sponsorAccount1 = document.getElementById('sponsor-account1').value;    
    		let auctionTime = $("#auction-time").val();
    		console.log(sponsorAccount1 + " sponsored " + auctionTime);
    			deployed.artAuction(auctionTime, sponsorAccount1/*web3.eth.accounts[parseInt(sponsorAccount1)]*/).then(
	    			function(f){
	    				$("#msg").html("Your auction has been successfully submitted!");
	           			$("#msg").show();
	            		console.log(f)
                //  temp = 1;
	    			}
    			);
    	//	});
    		event.preventDefault();
        });

        $("#stop-auction").submit(function(event){
        	$("#msg").hide();
        	let sponsorAccount2 = $("#sponsor-account2").val();
        	console.log(sponsorAccount2 + " stopped auction!");

          try{
      		  deployed.auctionEndFunction().then(
  	    			function(f){
  	    				$("#msg").html("Auction has been stopped successfully!");
  	           			$("#msg").show();
  	            		console.log(f)
  	    			}
      			);
    		  }catch(error){
            $("#msg").html("Auction hasn't finished!");
            $("#msg").show();
          }
    		event.preventDefault();
        });

        $("#bidding").submit(function(event) { 
      		$("#msg").hide();
      		//let bidderAccount1 = $("#bidder-account1").val();
          const bidderAccount1 = document.getElementById('bidder-account1').value;
      		let bidAmount = $("#bid-amount").val();
      		console.log(bidderAccount1 + " bid " + bidAmount);
  			  deployed.bid({
              from: bidderAccount1,//web3.eth.accounts[parseInt(bidderAccount1)]
      				value: web3.toWei(bidAmount,"ether")
      			}).then(
  	    			function(f){
  	    				$("#msg").html("Your bid has been successfully submitted!");
  	           			$("#msg").show();
  	            		console.log(f)
  	    			}
      			);
      		event.preventDefault();
        });

        $("#withdraw").submit(function(event) { 
    		$("#msg").hide();
    		let bidderAccount2 = $("#bidder-account2").val();
    		console.log(bidderAccount2 + " withdraw money!");
			  deployed.withdraw({
    				from: bidderAccount2//web3.eth.accounts[parseInt(bidderAccount1)]
    			}).then(
	    			function(f){
	    				$("#msg").html("Your bid has been successfully withdrawed!");
	           	$("#msg").show();
	            console.log(f)
	    			}
    			);
          event.preventDefault();
    	  });

        $("#highestBid").submit(function(event) { 
          $("#msg").hide();
          //var result = deployed.highestBid.call();
          deployed.highestBid.call().then(function(result){
            $("#msg").text("The highest bid is "+result);
            $("#msg").show();
            console.log(result);
          });
           event.preventDefault();
        });


	},
};

window.App = App
window.addEventListener('load', function () {
  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof web3 !== 'undefined') {
    console.warn(
      'Using web3 detected from external source.' +
      ' If you find that your accounts don\'t appear or you have 0 MetaCoin,' +
      ' ensure you\'ve configured that source properly.' +
      ' If using MetaMask, see the following link.' +
      ' Feel free to delete this warning. :)' +
      ' http://truffleframework.com/tutorials/truffle-and-metamask'
    )
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider)
  } else {
    console.warn(
      'No web3 detected. Falling back to http://127.0.0.1:7545.' +
      ' You should remove this fallback when you deploy live, as it\'s inherently insecure.' +
      ' Consider switching to Metamask for development.' +
      ' More info here: http://truffleframework.com/tutorials/truffle-and-metamask'
    )
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    window.web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:7545'))
  }
  //if (!temp) {
    App.start();
 // }
  
})