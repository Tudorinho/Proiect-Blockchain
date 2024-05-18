import React, { useState, useEffect } from "react";
import { useUser } from "../contexts/UserContext";
import { useMyPhones } from "../hooks/useMyPhones";
import { useDepositPhoneCoin } from "../hooks/useDepositPhoneCoin"; // Asigură-te că ai acest import

const MyPhones = () => {
    const userAddress = useUser();
    const { phones, loading, error } = useMyPhones(userAddress);
    const depositPhoneCoin = useDepositPhoneCoin(); // Folosim hook-ul pentru depozitul de PhoneCoin

    const [phonePrices, setPhonePrices] = useState({});

    useEffect(() => {
        // Salvăm prețurile în starea locală
        const prices = {};
        phones.forEach(phone => {
            prices[phone.tokenId] = phone.price;
        });
        setPhonePrices(prices);
    }, [phones]);

    const handleDeposit = async (tokenId) => {
        try {
            await depositPhoneCoin();
            // După depozit, actualizăm prețul telefoanelor
            const updatedPhones = phones.map(phone => {
                if (phone.tokenId === tokenId) {
                    return { ...phone, price: phone.price * 2 }; // De exemplu, dublăm prețul după depozit
                }
                return phone;
            });
            setPhonePrices(prevState => ({
                ...prevState,
                [tokenId]: prevState[tokenId] * 2
            }));
        } catch (error) {
            console.error("Failed to deposit PhoneCoin", error);
        }
    };

    return ( 
        <div>
            {userAddress ? (
                <div>
                    <h1>My Phones</h1>
                    <p>Address: {userAddress}</p>
                    {loading && <div>Loading...</div>}
                    {error && <div>Error: {error}</div>}
                    <ul>
                        {phones.map(phone => (
                            <li key={phone.tokenId}>
                                Token ID: {phone.tokenId}, Token URI: {phone.tokenURI}, Price: {phonePrices[phone.tokenId]} WEI
                                <br></br>
                                <button onClick={() => handleDeposit(phone.tokenId)}>Deposit PhoneCoin</button>
                            </li>
                        ))}
                    </ul>
                </div>
            ) : (
                <div>Please connect your wallet</div>
            )}
        </div>
     );
}
 
export default MyPhones;
