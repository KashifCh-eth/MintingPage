import { useContext } from "react";
import { web3Context } from "./web3Context";

const useWeb3 = () => {
    const { web3, setWeb3, walletAddress, setWalletAddress } = useContext(web3Context);
    return {
        web3,
        walletAddress,
        setWeb3,
        setWalletAddress
    };
};

export default useWeb3;
