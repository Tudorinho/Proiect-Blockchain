import { useState, useEffect } from 'react';
import { phoneMarketplaceContract } from '../ethersConnect';  // Adjust path as necessary
import { phoneNftContract } from '../ethersConnect';

export function useAvailablePhones() {
    const [phones, setPhones] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPhones = async () => {
            setLoading(true);
            try {
                console.log(phoneMarketplaceContract);
                const phoneData = await phoneMarketplaceContract.getPhoneListings();
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

        // fetchPhones();
    }, []);  

    return { phones, loading, error };
}
