////////艺术品拍卖系统
pragma solidity 0.4.24;

contract ArtAuction{
	//定义拍卖所需的参数
	//拍卖发起者
	address public auctionSponsor;
	//拍卖结束时间
	uint public auctionEnd;
	//拍卖结束状态
	//当结束时该值置为true，停止拍卖
	bool endStatus;

	//当前最高出价
	uint public highestBid;
	//当前出价最高者
	address public highestBidder;

	//由于最高价会不断更改
	//设置一个之前需要被退回的出价
	mapping(address => uint) returnBid;

	//最高价更改时触发事件
	event highestBidChange(address bidder, uint bid);
	//拍卖结束时触发事件
	event auctionEnded(address winner, uint bid);

	//创建拍卖
	//@param _bidTime 拍卖持续时间
	//@param _auctionSponpor 拍卖发起者 
	function artAuction(uint _bidTime, address _auctionSponpor) public {
		auctionEnd = now + _bidTime;
		auctionSponsor = _auctionSponpor;
	}

	//拍卖出价
	//若拍卖价格未超过当前最高价 则退回价格
	function bid() public payable{
		//确保拍卖未结束
		require(now <= auctionEnd);
		//确保出价高于最高出价
		//否则退回
		require(msg.value > highestBid);

		if (highestBidder != address(0)) {
			returnBid[highestBidder] += highestBid;
		}
		highestBidder = msg.sender;
		highestBid = msg.value;
		//事件调用
		emit highestBidChange(msg.sender, msg.value);
	}

	//当该出价已被超越时 取回出价
	function withdraw() public returns (bool){
		uint bid = returnBid[msg.sender];
		//将出价返回后，清空需要归还的出价
		//以便下次出价被退回时调用
		if (bid > 0) {
			returnBid[msg.sender] = 0;
			//当出价未归还时，重新将该出价者需要归还的出价存入
			//再返回false
			if (!msg.sender.send(bid)) {
				returnBid[msg.sender] = bid;
				return false;
			}
		}
		return true;
	}

	//拍卖结束
	//拍卖发起者获得最高出价数目的钱
	function auctionEndFunction() public{
		//确保拍卖未结束
		require(now >= auctionEnd);
		//确保该函数未被调用过
		require(!endStatus);

		endStatus = true;
		//事件调用
		emit auctionEnded(highestBidder, highestBid);
		//发起者获得收益
		auctionSponsor.transfer(highestBid);
	}
	function () public{
        revert();
      }

}
