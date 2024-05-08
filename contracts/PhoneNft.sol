// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

contract PhoneNft is ERC721Enumerable, ERC721URIStorage, Ownable {
    // The uri of the token will be an IPFS hash
    uint256 public tokenNumber;

    constructor() ERC721("PhoneNft", "PNFT") Ownable(msg.sender) {
        tokenNumber = 0;
    }

    event Minted(address indexed owner, uint256 indexed tokenId);

    function _update(address to, uint256 tokenId, address auth) internal override(ERC721, ERC721Enumerable) returns (address) {
      return super._update(to, tokenId, auth);
    }

    function _increaseBalance(address account, uint128 value) internal override(ERC721, ERC721Enumerable) {
      super._increaseBalance(account, value);
    }

    function getTokenNumber() public view returns (uint256) {
        return tokenNumber;
    }

    function supportsInterface(bytes4 interfaceId)public view override(ERC721Enumerable, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function mint(address owner, string memory tokenURI) public onlyOwner {
        tokenNumber++;
        uint256 tokenId = tokenNumber;
        _safeMint(owner, tokenId);
        _setTokenURI(tokenId, tokenURI);
        emit Minted(owner, tokenId);
    }

    function getPhonesOwned(address owner) public view returns (uint256[] memory) {
        uint256 tokenCount = balanceOf(owner);
        uint256[] memory tokensOwned = new uint256[](tokenCount);
        for (uint256 i = 0; i < tokenCount; i++) {
            tokensOwned[i] = tokenOfOwnerByIndex(owner, i);
        }
        return tokensOwned;
    }
}
