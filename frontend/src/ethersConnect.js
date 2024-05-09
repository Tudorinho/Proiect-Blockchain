import { ethers } from 'ethers';
import PhoneToken from './contracts/PhoneToken.json';
import PhoneMarketplace from './contracts/PhoneMarketplace.json';

const provider = new ethers.BrowserProvider(window.ethereum);
const signer = await provider.getSigner();

const phoneTokenContract = new ethers.Contract(
  PhoneToken.address,
  PhoneToken.abi,
  signer
);

const phoneMarketplaceContract = new ethers.Contract(
  PhoneMarketplace.address,
  PhoneMarketplace.abi,
  signer
);

export { phoneTokenContract, phoneMarketplaceContract };
