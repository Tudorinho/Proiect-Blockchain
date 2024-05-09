import React from 'react';
import { useAvailablePhones } from '../hooks/useAvailablePhones'; 

function AvailablePhones() {
    const { phones, loading, error } = useAvailablePhones();

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <h1>Available Phones</h1>
            <ul>
                {phones.map(phone => (
                    <li key={phone.tokenId}>
                        Token ID: {phone.tokenId}, Price: {phone.price} WEI
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default AvailablePhones;
