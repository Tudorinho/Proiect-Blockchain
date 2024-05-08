require("@nomiclabs/hardhat-ethers");
const { ethers } = require("hardhat");

async function deploy() {
    [owner, user1, user2, user3] = await ethers.getSigners();
    ipfsHashes = [
        "QmVX1FradDrFEZVK3A1NxdJ8k3knKHjXHunz699vrmsNR1",
        "QmXGzcMAoJ1vHUjHogwXLbbHVXPPjV4p3dS6tfhD4VeU9p",
        "QmanS2xbq888tbfaSW6Xy9G9zQ9z7bvwxdpN7pH89p3c2U",
        "QmdCpyGg17gPHPLV9vbR5jAvvvCzDfSPnKPNyi8A8oFM93"
    ]
    console.log("Owner address:", owner.address);
    console.log("User1 address:", user1.address);
    console.log("User2 address:", user2.address);
    console.log("User3 address:", user3.address);

    let phoneNftAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
    let phoneNft = await ethers.getContractAt("PhoneNft", phoneNftAddress);
    
    let phoneCoinAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
    let phoneCoin = await ethers.getContractAt("PhoneCoin", phoneCoinAddress);

    let phoneMarketAddress = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
    let phoneMarket = await ethers.getContractAt("PhoneMarket", phoneMarketAddress);

    // Minting 3 phones to user1 and 1 phone to user2
    let tx = await phoneNft.connect(owner).mint(user1.address, ipfsHashes[0]);
    await tx.wait();
    tx = await phoneNft.connect(owner).mint(user1.address, ipfsHashes[1]);
    await tx.wait();
    tx = await phoneNft.connect(owner).mint(user1.address, ipfsHashes[2]);
    await tx.wait();
    tx = await phoneNft.connect(owner).mint(user2.address, ipfsHashes[3]);
    await tx.wait();

    // Checking to see how many phones user1 has
    let user1Phones = await phoneNft.connect(user1).balanceOf(user1.address);
    console.log("User1 phones:", user1Phones.toString());

    // Checking to see how many phones user2 has
    let user2Phones = await phoneNft.connect(user2).balanceOf(user2.address);
    console.log("User2 phones:", user2Phones.toString());

    // Approving 2 of user1's phones to be sold on the market
    tx = await phoneNft.connect(user1).approve(phoneMarket.address, 1);
    await tx.wait();
    tx = await phoneNft.connect(user1).approve(phoneMarket.address, 2);
    await tx.wait();

    // Listing user1's phones on the market
    tx = await phoneMarket.connect(user1).listPhone(1, ethers.utils.parseEther("5"));
    await tx.wait();
    tx = await phoneMarket.connect(user1).listPhone(2, ethers.utils.parseEther("10"));
    await tx.wait();

    // Checking to see if user1's phones are listed on the market
    let listings = await phoneMarket.connect(user1).getPhoneListings();
    console.log("Listings:", listings);

    // Depositing 100 phone coins as user2
    let overwrite = {
        value: ethers.utils.parseEther("100")
    }
    tx = await phoneCoin.connect(user2).deposit(overwrite);
    await tx.wait();
    
    // Checking user2's balance
    let user2Balance = await phoneCoin.connect(user2).balanceOf(user2.address);
    console.log("User2 balance:", user2Balance.toString());

    // Approving the market to spend 20 phone coins
    tx = await phoneCoin.connect(user2).approve(phoneMarket.address, ethers.utils.parseEther("50"));
    await tx.wait();
    console.log("Approved market to spend 50 phone coins");

    // Buying user1's phone
    tx = await phoneMarket.connect(user2).buyPhone(1);
    await tx.wait();

    // Checking user1's balance
    user1Balance = await phoneCoin.connect(user1).balanceOf(user1.address);
    console.log("User1 balance:", user1Balance.toString());

    // Checking user2's balance
    user2Balance = await phoneCoin.connect(user2).balanceOf(user2.address);
    console.log("User2 balance:", user2Balance.toString());

    // Checking the contract's balance
    contractBalance = await phoneCoin.connect(owner).balanceOf(phoneMarket.address);
    console.log("Contract balance:", contractBalance.toString());

    // Checking user1's phones
    user1Phones = await phoneNft.connect(user1).getPhonesOwned(user1.address);
    console.log("User1 phones:", user1Phones);

    // Checking user2's phones
    user2Phones = await phoneNft.connect(user2).getPhonesOwned(user2.address);
    console.log("User2 phones:", user2Phones);

    // Checking the contract's listings
    listings = await phoneMarket.connect(owner).getPhoneListings();
    console.log("Listings:", listings);

    // Depositing 100 phone coins as user3
    overwrite = {
        value: ethers.utils.parseEther("100")
    }
    tx = await phoneCoin.connect(user3).deposit(overwrite);
    await tx.wait();

    // Approving the market to spend 12 phone coins
    tx = await phoneCoin.connect(user3).approve(phoneMarket.address, ethers.utils.parseEther("12"));
    await tx.wait();

    // Buying the other phone as user3
    tx = await phoneMarket.connect(user3).buyPhone(2);
    await tx.wait();

    // Checking user1's phones
    user1Phones = await phoneNft.connect(user1).getPhonesOwned(user1.address);
    console.log("User1 phones:", user1Phones);

    // Checking user3's phones
    user3Phones = await phoneNft.connect(user3).getPhonesOwned(user3.address);
    console.log("User3 phones:", user3Phones);

    // Checking user2's phones
    user2Phones = await phoneNft.connect(user2).getPhonesOwned(user2.address);
    console.log("User2 phones:", user2Phones);
}

deploy()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
