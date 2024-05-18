import { useState, useEffect } from "react";
import { phoneNftContract } from "../ethersConnect"; // Importăm phoneNftContract

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
                const tokenIds = await phoneNftContract.getPhonesOwned(address);
                console.log("TokenIds: ", tokenIds);
                
                const tokenURIs = await Promise.all(
                    tokenIds.map((tokenId) => phoneNftContract.tokenURI(tokenId))
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
