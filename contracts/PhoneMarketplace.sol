// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import {IERC721Receiver} from "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "./PhoneCoin.sol";
import "./PhoneNft.sol";

contract PhoneMarket is IERC721Receiver, Ownable {
    PhoneCoin public phoneCoin;
    PhoneNft public phoneNft;
    uint256 public constant FEE = 2; // 2% buy fee

    event PhoneListed(uint256 indexed tokenId, uint256 price, address indexed seller);
    event PhoneUnlisted(uint256 indexed tokenId, address indexed seller);
    event PhoneSold(uint256 indexed tokenId, uint256 price, address indexed seller, address indexed buyer);

    struct PhoneListing {
        uint256 tokenId;
        uint256 price;
        uint256 fee;
        address seller;
    }

    mapping(uint256 => PhoneListing) public phoneListings;

    constructor(address _phoneCoin, address _phoneNft) Ownable(msg.sender) {
        phoneCoin = PhoneCoin(_phoneCoin);
        phoneNft = PhoneNft(_phoneNft);
    }

    function onERC721Received(address operator, address from, uint256 tokenId, bytes calldata data) external override returns (bytes4) {
        return this.onERC721Received.selector;
    }

    function withdrawPhoneCoin() external onlyOwner {
        phoneCoin.transfer(msg.sender, phoneCoin.balanceOf(address(this)));
    }

    modifier buyPhoneChecks(uint256 _tokenId) {
        require(phoneListings[_tokenId].seller != msg.sender, "Caller is the seller of the phone");
        require(phoneListings[_tokenId].seller != address(0), "Phone is not listed");
        uint256 price = phoneListings[_tokenId].price;
        uint256 fee = phoneListings[_tokenId].fee;
        require(phoneCoin.allowance(msg.sender, address(this)) >= price + fee, "Contract is not approved to transfer the funds");
        _;
    }

    function buyPhone(uint256 _tokenId) external buyPhoneChecks(_tokenId) {
        PhoneListing memory listing = phoneListings[_tokenId];
        
        phoneCoin.transferFrom(msg.sender, address(this), listing.fee);

        phoneCoin.transferFrom(msg.sender, listing.seller, listing.price);
        phoneNft.safeTransferFrom(address(this), msg.sender, _tokenId);
        delete phoneListings[_tokenId];
        emit PhoneSold(_tokenId, listing.price, listing.seller, msg.sender);
    }

    modifier listPhoneChecks(uint256 _tokenId, uint256 _price) {
        require(phoneNft.ownerOf(_tokenId) == msg.sender, "Caller is not the owner of the phone");
        require(phoneListings[_tokenId].seller == address(0), "Phone is already listed");
        require(phoneNft.getApproved(_tokenId) == address(this), "Contract is not approved to transfer the phone");
        _;
    }

    function listPhone(uint256 _tokenId, uint256 _price) external listPhoneChecks(_tokenId, _price) {

        phoneNft.safeTransferFrom(msg.sender, address(this), _tokenId);
        phoneListings[_tokenId] = PhoneListing({
            tokenId: _tokenId, 
            price: _price,
            fee: _price * FEE / 100, 
            seller: msg.sender
            });
        emit PhoneListed(_tokenId, _price, msg.sender);
    }

    modifier onlySellerOf(uint256 _tokenId) {
        require(phoneListings[_tokenId].seller == msg.sender, "Caller is not the seller of the phone");
        _;
    }

    function unlistphone(uint256 _tokenId) external onlySellerOf(_tokenId){
        phoneNft.safeTransferFrom(address(this), msg.sender, _tokenId);
        delete phoneListings[_tokenId];
        emit PhoneUnlisted(_tokenId, msg.sender);
    }

    function getPhoneListings() external view returns (PhoneListing[] memory) {
        uint256 totalListings = phoneNft.getTokenNumber();
        uint256 listingsCount = 0;
        PhoneListing[] memory tempPhoneListings = new PhoneListing[](totalListings);

        for (uint256 i = 1; i < totalListings; i++) {
            if (phoneListings[i].seller != address(0)) {
                tempPhoneListings[listingsCount] = phoneListings[i];
                listingsCount++;
            }
        }

        PhoneListing[] memory allListings = new PhoneListing[](listingsCount);
        for(uint256 i = 0; i < listingsCount; i++) {
            allListings[i] = tempPhoneListings[i];
        }
        
        return allListings;
    }
}
