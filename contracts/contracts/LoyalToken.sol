// SPDX-License-Identifier: MIT
pragma solidity >=0.8.9;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";




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
    uint256 public nftCount;
    // TODO: change tokenAddres of struct to clientAddress
    bool isDestroyed;
    constructor(
        string memory name,
        string memory symbol,
        uint8 decimals_,
        address owner
    ) ERC20(name, symbol) {
        _decimals = decimals_;
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


    function beforeTokenTransfer(address from, address to, uint256 amount) internal virtual {
        require(!isDestroyed, "Token is destroyed");
        // super.beforeTokenTransfer(from, to, amount);
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

    function removeOwner(address _address) public onlyOwner {
        require(isOwner[_address], "Already not an owner");

        isOwner[_address] = false;
    }


    // // setter method for hasMinted, called from ERC721Token
    // function setHasMinted(address client) public {
    //     require(tx.origin == address(nft), "Not authorized");
    //     require(!hasMinted[client], "Already minted");
    //     hasMinted[client] = true;
    // }




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