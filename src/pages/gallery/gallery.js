import React, { useEffect, useState } from 'react';
import './gallery.css';
import contractInstance from '../../contracts/lockInstance';
import useWeb3 from "../../components/useWeb3";
import axios from 'axios';
import { Card } from './card';
// Simple counter using React Hooks
export const Gallery = () => {
    const [count, setCount] = useState(0);
    const { web3, setWeb3, walletAddress, setWalletAddress } = useWeb3();
    const [metadataArray, setMetadataArray] = useState([]);

    useEffect(() => {
        if (walletAddress.length > 0)
            getTotalSupply();
    }, [walletAddress])

    const getTotalSupply = async () => {
        const contract = await contractInstance;
        try {
            const res = await contract.getUserNFTs(walletAddress);
            const metadata_array = [];
            for (var i = 0; i < res.length; i++) {
                const url = await contract.getTokenURL(res[i]);
                const data = await axios.get(url);
                if (data.status === 200)
                    metadata_array.push(data.data);
            }
            setMetadataArray(metadata_array);
        } catch (e) {

        }
    }

    useEffect(() => {
        console.log("fetch done", metadataArray);
    }, [metadataArray])

    return (
        <section className="main-section">
            <div className="row mr-0">
                {
                    walletAddress.length > 0 && metadataArray.length == 0 &&
                    <div className='d-flex justify-content-center' style={{ marginTop: "100px", color: "white" }}>
                        <div className="spinner-border" ></div>
                    </div>
                }
                {
                    metadataArray.map((item, index) => (
                        <Card item={item} key={index} />
                    ))
                }
            </div>
        </section >
    );
};