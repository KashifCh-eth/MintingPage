import React, { useEffect, useState } from 'react';
import './home.css';
import Web3 from 'web3';
import tokenAbi from '../../contracts/tokenAbi';
import abi from '../../contracts/abi';
import contractInstance from '../../contracts/lockInstance';
import getContractsAddress from '../../contracts/contractsAddress';
import { NotificationManager } from 'react-notifications';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useWeb3 from "../../components/useWeb3";
import { off } from 'process';

const BUSD_ADDRESS = "0xe9e7cea3dedca5984780bafc599bd69add087d56";

function toPlainString(num) {
    return ('' + +num).replace(/(-?)(\d*)\.?(\d*)e([+-]\d+)/,
        function (a, b, c, d, e) {
            return e < 0
                ? b + '0.' + Array(1 - e - c.length).join(0) + c + d
                : b + c + d + Array(e - d.length + 1).join(0);
        });
}

// Simple counter using React Hooks
export const Home = () => {
    const [count, setCount] = useState(0);
    const [mintCost, setMintCost] = useState(40);
    const [mintReward, setMintReward] = useState(0);
    const { web3, walletAddress } = useWeb3();
    const [supply, setSupply] = useState(0);
    const notify = () => toast.info('Connect your wallet', {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
    });
    const provider = () => {
        // 1. Try getting newest provider
        const { ethereum } = window
        if (ethereum) return ethereum

        // 2. Try getting legacy provider
        const { web3 } = window
        if (web3 && web3.currentProvider) return web3.currentProvider
    }

    useEffect(() => {
        getTotalSupply()
        getMintCost();
    }, []);

    useEffect(() => {
        if (walletAddress.length)
            getMintReward(walletAddress);
        else
            setMintReward(0);
    }, [walletAddress]);

    const getMintCost = async () => {
        const contract = await contractInstance;
        try {
            const res = await contract.getMintCost();
            const cost = web3.utils.fromWei(toPlainString(res), 'ether');
            setMintCost(cost);
        } catch (e) {
            createNotification('error');
        }
    }

    const getMintReward = async (wallet) => {
        const contract = await contractInstance;
        try {
            const res = await contract.getMintReward(wallet);
            const cost = web3.utils.fromWei(toPlainString(res), 'ether');
            setMintReward(cost);
        } catch (e) {
            createNotification('error');
        }
    }

    const getTotalSupply = async () => {
        const contract = await contractInstance;
        try {
            const res = await contract.totalSupply();
            setSupply(res);
        } catch (e) {
            createNotification('error');
        }
    }

    async function mint() {
        if (walletAddress.length && count > 0) {
            const tokenContract = new web3.eth.Contract(
                tokenAbi,
                BUSD_ADDRESS
            );

            const balance = await tokenContract.methods.balanceOf(walletAddress).call();
            const balance_decimal = web3.utils.fromWei(toPlainString(balance), 'ether');

            const nftContract = new web3.eth.Contract(
                abi,
                getContractsAddress(97)
            );

            if (balance_decimal < mintCost * count) {
                toast.error('Insufficient BUSD balance!', {
                    position: "top-right",
                    autoClose: 1000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
                return;
            }

            const cost = web3.utils.toWei(toPlainString(parseFloat(mintCost * count).toFixed(4)), 'ether');

            try {
                await tokenContract.methods.approve(getContractsAddress(97), cost).send({
                    from: walletAddress
                });

                nftContract.methods.mint(count).send({
                    from: walletAddress
                })
                    .on('transactionHash', function (hash) {
                        const supply_num = parseInt(supply);
                        const updated = supply_num + parseInt(count);
                        setSupply((updated).toString());
                    })
            } catch (e) {
                createNotification('error');
            }
        }
        else if (count <= 0) {
            toast.info('Mint amount is incorrect!', {
                position: "top-right",
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        }
        else {
            notify();
        }
    }

    async function claimReward() {
        if (walletAddress.length <= 0) {
            notify();
            return;
        }
        const contract = await contractInstance;
        try {
            await contract.claimReward(walletAddress);
        } catch (e) {
            createNotification('error');
        }
    }

    function createNotification(type) {
        return () => {
            switch (type) {
                case 'info':
                    NotificationManager.info('Info message');
                    break;
                case 'success':
                    NotificationManager.success('Success message', 'Success');
                    break;
                case 'error':
                    NotificationManager.success('Invalid input parameters', 'Failed');
                    break;
                case 'wallet':
                    NotificationManager.info('Connect your wallet');
                    break;
            }
        };
    };

    return (
        <>
            <section className="main-section">
                <div className="row mr-0">
                    <div className="col" style={{ paddingRight: "50px", paddingLeft: "50px", marginTop: "50px" }}>
                        <div>
                            <div className="card home-section-card">
                                <div className="card-body"></div>
                                <div className="row">
                                    <div className="col-xl-12 home-mint-count-div">
                                        <h1 className="home-mint-count-text">{supply}/5000</h1>
                                    </div>
                                    <div className="col-xl-12 home-price-div">
                                        <input type="number" className="home-price-input" value={count} onChange={(e) => setCount(e.target.value)} />
                                        <p className="home-price-total-label">Total price in BUSD:</p>
                                        <input type="text" className="home-price-total-input" value={count * mintCost} readOnly />
                                    </div>
                                    <div className="col-xl-12 text-center-with-padding-50">
                                        <button
                                            className="btn btn-primary home-mint-button" data-bss-hover-animate="pulse" type="button" onClick={mint}>Mint</button>
                                    </div>
                                    <div className="col-xl-12 text-center-with-padding-50">
                                        <p className="home-mint-slogan">Mint and sail away to PooIsland!</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col p-50-mt-50">
                        <div>
                            <div className="card home-gradient-card">
                                <div className="card-body"></div>
                                <div className="row">
                                    <div className="col-xl-12 text-center-with-padding-50" style={{ marginBottom: "60px", marginTop: "0px" }}>
                                        <h1 className="home-earned"> Earned:</h1>
                                    </div>
                                    <div className="col-xl-12 text-center-with-padding-50">
                                        <h1 className='home-earned-value'>
                                            {mintReward}
                                            <br />
                                            BUSD</h1>
                                    </div>
                                    <div className="col-xl-12 text-center-with-padding-50" style={{ marginBottom: "-11px", height: "50px" }}>
                                        <button className="btn btn-primary home-claim-button" data-bss-hover-animate="pulse" type="button" onClick={claimReward}>Claim</button>
                                    </div>
                                    <div className="col-xl-12" style={{ textAlign: "center" }}>
                                        <p className="home-marketing-banner">Holders Earn 40% of all future mints!</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <ToastContainer
                position="top-right"
                autoClose={1000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
        </>
    );
};