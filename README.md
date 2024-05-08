# phoneBase
DApp where people can sell and buy phones.

To install node dependencies:
```
npm install
```

# IPFS

## To get ipfs node running locally
```
tar xvfz kubo_v0.28.0_linux-amd64.tar.gz
sudo ./kubo/install.sh
ipfs init
ipfs daemon
```

## To add the phone metadata:
```
cd ipfs_data
ipfs add phone1.txt
ipfs add phone2.txt
ipfs add phone3.txt
ipfs add phone4.txt
```

After running each command you will get the hash that you use to access the metadata. Try running "ipfs cat <hash>" and see if the data is returned.
This hash needs to be passed to the nft contract when minting. You will probably need to replace the hashes in the interact script if you want to use that mock data when testing for frontend.
# To deploy the contracts locally:
For this you have to be in the root folder (phoneBase).
Open 2 terminals, in the first one run:
npx hardhat node

In the second one run:
npx hardhat run scripts/deploy.js --network localhost

To run the interact tests:
npx hardhat run scripts/interact.js --network localhost

To run the tests:
npx hardhat test