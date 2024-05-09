import { useState, useEffect } from 'react';
import { phoneMarketplaceContract } from '../ethersConnect';  // Adjust path as necessary

export function useAvailablePhones() {
    const [phones, setPhones] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPhones = async () => {
            setLoading(true);
            try {
                const phoneData = await phoneMarketplaceContract.getAvailableListings();
                console.log('PhoneData: ', phoneData);  
                setPhones(phoneData.map(phone => ({
                    tokenId: phone.tokenId.toString(),
                    price: phone.price.toString(),  // Convert BigNumber to string for easier handling
                    isAvailable: phone.isAvailable
                })));
                setError(null);
            } catch (err) {
                setError('Failed to fetch phones: ' + err.message);
                console.error(err);
            }
            setLoading(false);
        };

        fetchPhones();
    }, []);  

    return { phones, loading, error };
}
