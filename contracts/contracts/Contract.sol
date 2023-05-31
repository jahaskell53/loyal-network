// SPDX-License-Identifier: MIT
pragma solidity >=0.8.9;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract ERC721Token is ERC721URIStorage, Ownable {

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    mapping(uint256 => bool) public isRedeemed;

    struct OrderInfo {
        string item;
        uint256 amount;
        uint256 price;
        address tokenAddress;
        uint256 timestamp;
        uint256 orderNumber;

    }

    mapping(address => OrderInfo) public orderInfoMap;
    bool isDestroyed = false;
    // ERC20Token public tokenAddress;

    constructor(
        string memory name,
        string memory symbol,
        uint8 tokenDecimals
    ) ERC721(name, symbol) {
        // tokenAddress = new ERC20Token(name, symbol, tokenDecimals, );
    }

    // client will call mint after metadata is stored and order is accepted by merchant
    function mint(address _to, string calldata tokenUri) external returns (uint256) {
        uint256 newItemId = _tokenIds.current();
        _mint(_to, newItemId);
        _setTokenURI(newItemId, tokenUri);
        _tokenIds.increment();

        return newItemId;
    }

     function destroy() public onlyOwner {
        isDestroyed = true;
    }

    function _beforeTokenTransfer(address from, address to, uint256 tokenId, uint256 batchsize) internal virtual override {
        require(!isDestroyed, "Token is destroyed");
        super._beforeTokenTransfer(from, to, tokenId, batchsize);
    }

    // called by merchant to store info for minting NFT
    function storeOrderInfo(uint256 tokenId, address client, uint256 amount, uint256 price, uint256 timestamp, string calldata item, uint256 orderNumber) public onlyOwner {
        require(!isRedeemed[tokenId], "Token already redeemed");
        orderInfoMap[client] = OrderInfo({
            item: item,
            amount: amount,
            price: price,
            orderNumber: orderNumber,
            tokenAddress: client,
            timestamp: timestamp
        });
    }

    // get metadata of orderInfo, used by client to mint NFT
    function getOrderInfo(address client) public view returns (OrderInfo memory) {
        return orderInfoMap[client];
    }


    // view supply function

    // function redeem(uint256 tokenId, uint256 amount, address redeemer) external onlyOwner {
    //     require(!isRedeemed[tokenId], "Token already redeemed");

    //     address ownerOfToken = ownerOf(tokenId);

    //     require(redeemer == ownerOfToken, "Token doesn't belong to caller");

    //     isRedeemed[tokenId] = true;

    //     tokenAddress.mint(redeemer, amount);
    // }

      function totalSupply() public view returns (uint256) {
        // Your custom implementation here (overriding this function is optional)
        return _tokenIds.current();
    }
}



import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract ERC20Token is ERC20 {

    uint8 private _decimals;
    mapping(address => bool) isOwner;

       struct OrderInfo {
        uint256 amount;
        uint256 price;
        uint256 orderNumber;
        address tokenAddress;
        uint256 timestamp;
        string item;
    }
    // array of pending orders
    uint256[] public pendingOrders;
    uint256[] public acceptedOrders;
    mapping(uint256 => OrderInfo) public orderInfo;
    // mapping(address => bool) public hasPaid;
    uint256 orderCount;
    ERC721Token public nft;
    uint256 public nftCount;
    // TODO: change tokenAddres of struct to clientAddress
    bool isDestroyed;
    constructor(
        string memory name,
        string memory symbol,
        uint8 decimals_,
        ERC721Token inputNft,
        address owner
    ) ERC20(name, symbol) {
        _decimals = decimals_;
        nft = inputNft;
        nftCount = 0;
        orderCount = 0;
        isOwner[msg.sender] = true;
        isOwner[owner] = true;
        isDestroyed = false;
    }

    function burn(address sender, uint256 amount) public {
        _burn(sender, amount);
    }

    

    function destroy() public onlyOwner {
        isDestroyed = true;
    }


    function _beforeTokenTransfer(address from, address to, uint256 amount) internal virtual override {
        require(!isDestroyed, "Token is destroyed");
        super._beforeTokenTransfer(from, to, amount);
    }

    modifier onlyOwner() {
        require(isOwner[msg.sender],"Not Authorized");
        _;
    }

    function checkOwner(address _address) public view returns (bool) {
        return isOwner[_address];
    }

    function addOwner(address _address) public onlyOwner {
        require(!isOwner[_address], "Already an owner");

        isOwner[_address] = true;
    } 

    function getNFTContractAddress() public view returns (address) {
        return address(nft);
    }

    function removeOwner(address _address) public onlyOwner {
        require(isOwner[_address], "Already not an owner");

        isOwner[_address] = false;
    }

    

    // get pending orders from client for merchant
    function getPendingOrders() public view returns (OrderInfo[] memory) {
        OrderInfo[] memory orders = new OrderInfo[](pendingOrders.length);
        for (uint256 i = 0; i < pendingOrders.length; i++) {
            orders[i] = orderInfo[pendingOrders[i]];
        }
        return orders;
    }

    // // setter method for hasMinted, called from ERC721Token
    // function setHasMinted(address client) public {
    //     require(tx.origin == address(nft), "Not authorized");
    //     require(!hasMinted[client], "Already minted");
    //     hasMinted[client] = true;
    // }

    // get accepted orders from client for merchant
    function getAcceptedOrders() public view returns (OrderInfo[] memory) {
        OrderInfo[] memory orders = new OrderInfo[](acceptedOrders.length);
        for (uint256 i = 0; i < acceptedOrders.length; i++) {
            orders[i] = orderInfo[acceptedOrders[i]];
        }
        return orders;
    }

    function order(string calldata item, uint32 amount, uint32 price) public {
        // user create order
        // require(!hasPaid[msg.sender], "Already paid");
        // require(!hasMinted[msg.sender], "Already minted");
        orderInfo[orderCount] = OrderInfo({
            item: item,
            amount: amount,
            price: price,
            orderNumber: orderCount,
            tokenAddress: msg.sender,
            timestamp: block.timestamp
        });
        pendingOrders.push(orderCount);
        orderCount++;
        
    }

    function acceptOrder(uint256 orderNumber, string calldata rpi) public onlyOwner {
        // set boolean to true
        // require(!hasPaid[orderInfo[orderNumber].tokenAddress], "Already paid");
        // hasPaid[orderInfo[orderNumber].tokenAddress] = true;
        // mint NFT (ERC721) to user
        // nft.approve(orderInfo[orderNumber].tokenAddress, nftCount);
        // require(isOwner[tx.origin], "Not authorized");
        nft.mint(orderInfo[orderNumber].tokenAddress, rpi);
        // Create a memory instance of the OrderInfo struct before passing it
        nft.storeOrderInfo(nftCount, orderInfo[orderNumber].tokenAddress, orderInfo[orderNumber].amount, orderInfo[orderNumber].price, orderInfo[orderNumber].timestamp, orderInfo[orderNumber].item, orderInfo[orderNumber].orderNumber);
        nftCount++;
        // mint ERC20 token to user 
        mint(orderInfo[orderNumber].tokenAddress, orderInfo[orderNumber].amount * orderInfo[orderNumber].price * 10**18);
        // approve(orderInfo[orderNumber].tokenAddress, orderInfo[orderNumber].amount);
        // remove order from pending orders and put in accepted orders
        for (uint256 i = 0; i < pendingOrders.length; i++) {
            if (pendingOrders[i] == orderNumber) {
                acceptedOrders.push(pendingOrders[i]);
                pendingOrders[i] = pendingOrders[pendingOrders.length - 1];
                pendingOrders.pop();
                break;
            }
        }
        
    }

    function mint(address sender, uint256 amount) public onlyOwner {
        _mint(sender, amount);
        // nft.setHasMinted(msg.sender);
    }

    function redeem(address _from, uint256 amount) public onlyOwner {
        _burn(_from, amount);
    }

    function decimals() public view virtual override returns (uint8) {
        return _decimals;
    }
}


contract Factory {
    event ERC20TokenCreated(address tokenAddress);
    event ERC721TokenCreated(address tokenAddress);
    event Print(address facAddress, uint256 amount);
    struct OrderInfo {
        uint256 amount;
        uint256 price;
        uint256 timestamp;
        address tokenAddress;
        string item;
        uint256 orderNumber;
    }

    address public nftAddress;
    address public tokenAddress;
    uint256 lockInAmount;
    ERC20Token public token;
    ERC721Token public nft;
    ERC20Token public lylToken;
        mapping(address => uint256) lockedAmount;
    uint256 amountToRedeem;


    constructor() {
        // create erc20 token from loyal address
        lylToken = ERC20Token (loyalAddress);
        // lylToken = new ERC20Token("Loyalty Token", "LYL", 18, nft, address(this));
        lylToken.mint(msg.sender, 1 ether);
        lockInAmount = 0.1 ether;
    }

    // function approveLoyaltyToken() public {
    //     lylToken.approve(msg.sender, lockInAmount);
    // }




    function deployLoyaltyProgram(
        string calldata name,
        string calldata symbol,
        uint8 decimals,
        uint256 initialSupply,
        uint256 amountToR
    ) public returns (address) {
        //  require(lylToken.allowance(msg.sender, address(this)) >= lockInAmount, "Not enough allowance");
        // lylToken.approve(msg.sender, lockInAmount);
        //  require(lylToken.balanceOf(msg.sender) >= lockInAmount, "Not enough balance");
        //   lylToken.transferFrom(msg.sender, address(this), lockInAmount);
        require(lylToken.balanceOf(msg.sender) >= lockInAmount, "Not enough balance");
        // address(this).transfer(lockInAmount);
        lylToken.transferFrom(msg.sender, address(this), lockInAmount);
          lockedAmount[msg.sender] = lockInAmount;
          amountToRedeem = amountToR;
        // The ERC721 contract needs to be created here, take a look at the NFT contract's constructor. The NFT contract creates the corresponding ERC20 contract so the permissions are properly set 
        // create receipts
        ERC721Token n = new ERC721Token(
            name,
            symbol,
            decimals
        );

        // create loyalty tokens
       ERC20Token t = new ERC20Token(
            name,
            symbol,
            decimals, 
            n,
            msg.sender
        );

        nftAddress = address(n);
        tokenAddress = address(t);

        n.transferOwnership(tokenAddress);

        nft = n;
        token = t;
        isActive = true;
        // add owner to erc 20 token
        // t.addOwner(msg.sender);
        emit ERC20TokenCreated(address(t));
        emit ERC721TokenCreated(address(n));
        
        isDeployed = true;
        // cleint has erc721 token address and erc20 token address
        return address(t);
    }

    // wrapper function for ERC20's order
    function order(string calldata item, uint32 amount, uint32 price) public {
       token.order(item, amount, price);
    }

        function payForOrderWithTokens(uint256 amount, string calldata nftUri) public {
        require(amount >= amountToRedeem, "Not enough tokens to redeem");
       token.burn(msg.sender, amount); 
       nft.mint(msg.sender, nftUri);
    }

     function withdraw() public {
        require(lockedAmount[msg.sender] > 0, "No locked in amount");
        require(lylToken.balanceOf(msg.sender) >= lockedAmount[msg.sender], "Not enough balance");
        emit Print(msg.sender, lockedAmount[msg.sender]);
        // nft.destroy();
        token.destroy();
        // msg.sender.transfer(lockInAmount);
        
    //    lylToken.transferFrom(address(this), msg.sender, lockInAmount);
    //    lylToken.transfer(msg.sender, lockInAmount);
        lockedAmount[msg.sender] = 0;
        lylToken.transfer(msg.sender, lockedAmount[msg.sender]);

        isDeployed = false;
    }


    // wrapper function for ERC20's acceptOrder
    function acceptOrder(uint256 orderNumber, string calldata rpi) public {
        require(token.checkOwner(msg.sender), "Not authorized");
        token.acceptOrder(orderNumber, rpi);
    }

    // wrapper function for ERC20's getPendingOrders
    function getPendingOrders() public view returns (ERC20Token.OrderInfo[] memory) {
        return token.getPendingOrders();
    }

    // wrapper function for ERC20's getAcceptedOrders
    function getAcceptedOrders() public view returns (ERC20Token.OrderInfo[] memory) {
        return token.getAcceptedOrders();
    }

    // get erc721 token address
    function getNFTAddress() public view returns (address) {
        return nftAddress;
    }

    // get erc20 token address
    function getTokenAddress() public view returns (address) {
        return tokenAddress;
    }
}



// contract LoyalToken is ERC20 {
//     address owner;
//     constructor(string memory _name, string memory _symbol) ERC20(_name, _symbol) {
//        owner = msg.sender;
//     }

//     function mint(uint256 amount) public {
//         require(msg.sender == owner, "Not authorized");
//         _mint(owner, amount);
//     }
        
// }
