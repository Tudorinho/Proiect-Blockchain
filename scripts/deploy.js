require("@nomiclabs/hardhat-ethers");
const { ethers } = require("hardhat");

async function deploy() {
    [owner] = await ethers.getSigners();

    let phoneCoinFactory = await ethers.getContractFactory("PhoneCoin");
    let phoneCoin = await phoneCoinFactory.connect(owner).deploy();
    await phoneCoin.deployed();
    console.log("PhoneCoin deployed to:", phoneCoin.address);

    let phoneNftFactory = await ethers.getContractFactory("PhoneNft");
    let phoneNft = await phoneNftFactory.connect(owner).deploy();
    await phoneNft.deployed();
    console.log("PhoneNft deployed to:", phoneNft.address);

    let phoneMarketFactory = await ethers.getContractFactory("PhoneMarket");
    let phoneMarket = await phoneMarketFactory.connect(owner).deploy(phoneCoin.address, phoneNft.address);
    await phoneMarket.deployed();
    console.log("PhoneMarket deployed to:", phoneMarket.address);
}

deploy()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
    