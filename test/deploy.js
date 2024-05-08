const {ethers} = require("hardhat");
const common = require("./common.js");
const {max} = require("hardhat/internal/util/bigint");
const { expect } = require("chai");

describe("Test a flow in the app and the requirements", function () {
    let owner, user1, user2, user3;
    let phoneCoinContract, phoneNftContract, phoneMarketContract;
    ipfsHashes = [
        "QmVX1FradDrFEZVK3A1NxdJ8k3knKHjXHunz699vrmsNR1",
        "QmXGzcMAoJ1vHUjHogwXLbbHVXPPjV4p3dS6tfhD4VeU9p",
        "QmanS2xbq888tbfaSW6Xy9G9zQ9z7bvwxdpN7pH89p3c2U",
        "QmdCpyGg17gPHPLV9vbR5jAvvvCzDfSPnKPNyi8A8oFM93"
    ]

    before(async function () {
        await ethers.provider.send("hardhat_setLoggingEnabled", [false]);
        await common.init()

        owner = common.owner()
        user1 = common.user1()
        user2 = common.user2()
        user3 = common.user3()
    })

    beforeEach(async function () {
        let phoneCoinFactory = await ethers.getContractFactory("PhoneCoin");
        let phoneCoin = await phoneCoinFactory.deploy();
        await phoneCoin.deployed();
        phoneCoinContract = phoneCoin;

        let phoneNftFactory = await ethers.getContractFactory("PhoneNft");
        let phoneNft = await phoneNftFactory.deploy();
        await phoneNft.deployed();
        phoneNftContract = phoneNft;

        let phoneMarketFactory = await ethers.getContractFactory("PhoneMarket");
        let phoneMarket = await phoneMarketFactory.deploy(phoneCoin.address, phoneNft.address);
        await phoneMarket.deployed();
        phoneMarketContract = phoneMarket;

        // Minting 3 phones to user1 and 1 phone to user2
        let tx = await phoneNftContract.connect(owner).mint(user1.address, ipfsHashes[0]);
        await tx.wait();
        tx = await phoneNftContract.connect(owner).mint(user1.address, ipfsHashes[1]);
        await tx.wait();
        tx = await phoneNftContract.connect(owner).mint(user1.address, ipfsHashes[2]);
        await tx.wait();
        tx = await phoneNftContract.connect(owner).mint(user2.address, ipfsHashes[3]);
        await tx.wait();
    })

    it("Should check that the minting in the beforeEach function was successful", async function () {
        // Checking to see how many phones user1 has
        let user1Phones = await phoneNftContract.connect(user1).balanceOf(user1.address);
        expect(user1Phones.toString()).to.equal("3");

        // Checking to see how many phones user2 has
        let user2Phones = await phoneNftContract.connect(user2).balanceOf(user2.address);
        expect(user2Phones.toString()).to.equal("1");
    });

    it("Should check that depositing phone coins works", async function () {
        // Buying 17 phone coins as user2
        let overwrite = {value: ethers.utils.parseEther("17")};
        tx = await phoneCoinContract.connect(user2).deposit(overwrite);
        await tx.wait();

        // Checking user2's phone coin balance
        let user2Coins = await phoneCoinContract.connect(user2).balanceOf(user2.address);
        expect(user2Coins.toString()).to.equal(ethers.utils.parseEther("17").toString());

        // // Depositing 12 phone coins as user3
        overwrite = {value: ethers.utils.parseEther("12")};
        tx = await phoneCoinContract.connect(user3).deposit(overwrite);
        await tx.wait();

        // // Checking user3's phone coin balance
        let user3Coins = await phoneCoinContract.connect(user3).balanceOf(user3.address);
        expect(user3Coins.toString()).to.equal(ethers.utils.parseEther("12").toString());
    });

    it("Should check if listing phones works", async function () {
        // Approving 2 of user1's phones to be sold on the market
        let tx = await phoneNftContract.connect(user1).approve(phoneMarketContract.address, 1);
        await tx.wait();
        tx = await phoneNftContract.connect(user1).approve(phoneMarketContract.address, 2);
        await tx.wait();

        // Listing user1's phones on the market
        tx = await phoneMarketContract.connect(user1).listPhone(1, ethers.utils.parseEther("5"));
        await tx.wait();
        tx = await phoneMarketContract.connect(user1).listPhone(2, ethers.utils.parseEther("10"));
        await tx.wait();

        // Checking to see if user1's phones are listed on the market
        let listings = await phoneMarketContract.connect(user1).getPhoneListings();
        expect(listings.length).to.equal(2);

        // Checking first listing's details
        let listing = listings[0];
        expect(listing.seller).to.equal(user1.address);
        expect(listing.tokenId.toString()).to.equal("1");
        expect(listing.price.toString()).to.equal(ethers.utils.parseEther("5").toString());
    });

    it("Should simulate user2 buying first phone from user1 and user3 buying second phone from user1.", async function () {
        // Approving 2 of user1's phones to be sold on the market
        let tx = await phoneNftContract.connect(user1).approve(phoneMarketContract.address, 1);
        await tx.wait();
        tx = await phoneNftContract.connect(user1).approve(phoneMarketContract.address, 2);
        await tx.wait();

        // Listing user1's phones on the market
        tx = await phoneMarketContract.connect(user1).listPhone(1, ethers.utils.parseEther("5"));
        await tx.wait();
        tx = await phoneMarketContract.connect(user1).listPhone(2, ethers.utils.parseEther("10"));
        await tx.wait();

        // Buying 17 phone coins as user2
        let overwrite = {value: ethers.utils.parseEther("17")};
        tx = await phoneCoinContract.connect(user2).deposit(overwrite);
        await tx.wait();

        // Allowing contract to spend 6 phone coins
        tx = await phoneCoinContract.connect(user2).approve(phoneMarketContract.address, ethers.utils.parseEther("6"));
        await tx.wait();

        // Buying first phone from user1
        tx = await phoneMarketContract.connect(user2).buyPhone(1);
        await tx.wait();

        // Checking user2's phone balance
        user2Phones = await phoneNftContract.connect(user2).balanceOf(user2.address);
        expect(user2Phones.toString()).to.equal("2");

        // Checking remaining listings
        listings = await phoneMarketContract.connect(user1).getPhoneListings();
        expect(listings.length).to.equal(1);

        // // Depositing 12 phone coins as user3
        overwrite = {value: ethers.utils.parseEther("12")};
        tx = await phoneCoinContract.connect(user3).deposit(overwrite);
        await tx.wait();

        // // Allowing contract to spend 11 phone coins
        tx = await phoneCoinContract.connect(user3).approve(phoneMarketContract.address, ethers.utils.parseEther("11"));
        await tx.wait();

        // // Buying second phone from user1
        tx = await phoneMarketContract.connect(user3).buyPhone(2);
        await tx.wait();

        // // Checking user3's phone balance
        user3Phones = await phoneNftContract.connect(user3).balanceOf(user3.address);
        expect(user3Phones.toString()).to.equal("1");

        // // Checking remaining listings
        listings = await phoneMarketContract.connect(user1).getPhoneListings();
        expect(listings.length).to.equal(0);

        // // Checking user1's phone balance
        user1Phones = await phoneNftContract.connect(user1).balanceOf(user1.address);
        expect(user1Phones.toString()).to.equal("1");

        // // Checking getPhonesOwned
        let ownedPhones = await phoneNftContract.connect(user1).getPhonesOwned(user1.address);
        expect(ownedPhones.length).to.equal(1);
    });

    it("Should test most of the requirements", async function () {
        // Trying to list phone without approving them
        try {
                await phoneMarketContract.connect(user1).listPhone(1, ethers.utils.parseEther("5"));
                throw new Error("Should have failed");
        } catch (e) {
                expect(e.message).to.include("Contract is not approved to transfer the phone");
        }

        // Trying to list phone without owning it
        try {
            await phoneMarketContract.connect(user2).listPhone(1, ethers.utils.parseEther("5"));
            throw new Error("Should have failed");
        } catch (e) {
            expect(e.message).to.include("Caller is not the owner of the phone");
        }

        // Trying to list an already listed phone
        let tx = await phoneNftContract.connect(user1).approve(phoneMarketContract.address, 1);
        await tx.wait();
        tx = await phoneMarketContract.connect(user1).listPhone(1, ethers.utils.parseEther("5"));
        await tx.wait();
        try {
            await phoneMarketContract.connect(user1).listPhone(1, ethers.utils.parseEther("5"));
            throw new Error("Should have failed");
        } catch (e) {
            expect(e.message).to.include("Phone is already listed");
        }

        // Trying to buy a phone as the seller
        try {
            await phoneMarketContract.connect(user1).buyPhone(1);
            throw new Error("Should have failed");
        } catch (e) {
            expect(e.message).to.include("Caller is the seller of the phone");
        }

        // Trying to buy a phone that is not listed
        try {
            await phoneMarketContract.connect(user2).buyPhone(2);
            throw new Error("Should have failed");
        } catch (e) {
            expect(e.message).to.include("Phone is not listed");
        }

        // Trying to buy a phone without enough phone coins
        try {
            await phoneMarketContract.connect(user2).buyPhone(1);
            throw new Error("Should have failed");
        } catch (e) {
            expect(e.message).to.include("Contract is not approved to transfer the funds");
        }
    });
});
