import { ethers } from 'ethers';
import PhoneNft from './contracts/PhoneNft.json';
import PhoneMarketplace from './contracts/PhoneMarketplace.json';
import PhoneCoin from './contracts/PhoneCoin.json'

const provider = new ethers.BrowserProvider(window.ethereum);
const signer = await provider.getSigner();

const phoneNftContract = new ethers.Contract(
  PhoneNft.address,
  PhoneNft.abi,
  signer
);

const phoneMarketplaceContract = new ethers.Contract(
  PhoneMarketplace.address,
  PhoneMarketplace.abi,
  signer
);

const phoneCoinContract = new ethers.Contract(
  PhoneCoin.address,
  PhoneCoin.abi,
  signer
);

export { phoneNftContract, phoneMarketplaceContract, phoneCoinContract };
