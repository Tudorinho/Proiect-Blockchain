import { useState, useEffect } from "react";
import { phoneMarketplaceContract, phoneTokenContract } from "../ethersConnect"; 

export function useMyPhones(address) {
  const [phones, setPhones] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPhones = async () => {
        if (!address) {
            setPhones([]);
            setError("User address is null, unable to fetch phones");
            setLoading(false);
            return;
        }

      setLoading(true);

      try {
        console.log("Fetching phones owned by: ", address);
        const response = await phoneMarketplaceContract.getPhonesOwnedBy(address);
        console.log("Response: ", response);
        
        const tokenIds = response.map((tokenId) => tokenId.toString());
        
        console.log("TokenIds: ", tokenIds);
        
        // call  function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory)
        const tokenURIs = await Promise.all(
          tokenIds.map((tokenId) => phoneTokenContract.tokenURI(tokenId))
        );

        console.log("TokenURIs: ", tokenURIs);
        setPhones(
          tokenIds.map((phone, index) => ({
            tokenId: phone.toString(),
            tokenURI: tokenURIs[index],
          }))
        );
        setError(null);
      } catch (err) {
        setError("Failed to fetch phones: " + err.message);
        console.error(err);
      }
      setLoading(false);
    };

      fetchPhones();
    
  }, [address]);

  return { phones, loading, error };
}
