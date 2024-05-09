import { useEffect } from "react";
import { useUser } from "../contexts/UserContext";
import { useMyPhones } from "../hooks/useMyPhones";

const MyPhones = () => {
    const userAddress = useUser();
    const { phones, loading, error } = useMyPhones(userAddress);
    console.log("UserAddress from MyPhones: ", userAddress);

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
                                Token ID: {phone.tokenId}, Price: {phone.price} WEI
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