import { phoneCoinContract } from "../ethersConnect";

export function useDepositPhoneCoin() {
    const depositPhoneCoin = async () => {
        try {
            // Implementează logica pentru a face depozit de PhoneCoin aici
            // De exemplu:
            const tx = await phoneCoinContract.depositPhoneCoin();
            await tx.wait();
            console.log("PhoneCoin deposited successfully!");
        } catch (error) {
            throw new Error("Failed to deposit PhoneCoin: " + error.message);
        }
    };

    return depositPhoneCoin;
}
