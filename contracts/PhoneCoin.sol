// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract PhoneCoin is ERC20, Ownable {
    uint256 public constant RATE = 1;

    event Withdrawal(address indexed user, uint256 tokenAmount, uint256 ethAmount);
    event Deposit(address indexed user, uint256 ethAmount, uint256 tokenAmount);

    constructor() ERC20("PhoneCoin", "PHC") Ownable(msg.sender) {}

    function deposit() external payable {
        require(msg.value > 0, "Deposit amount must be greater than 0.");
        
        uint256 tokens = msg.value * RATE;
        _mint(msg.sender, tokens);
        emit Deposit(msg.sender, msg.value, tokens);
    }

    function withdraw(uint256 tokens) external {
        require(tokens <= balanceOf(msg.sender), "Insufficient balance to withdraw from.");

        uint256 ethAmount = tokens / RATE;
        _burn(msg.sender, tokens);
        emit Withdrawal(msg.sender, tokens, ethAmount);
        payable(msg.sender).transfer(ethAmount);
    }
}
