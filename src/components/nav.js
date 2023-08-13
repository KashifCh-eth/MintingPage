import React, { useEffect } from 'react';
import { Link, useLocation } from "react-router-dom";

// Import button component
import Web3 from "web3";
import Web3Modal from "web3modal";
import WalletConnect from "@walletconnect/web3-provider";
import CoinbaseWalletSDK from '@coinbase/wallet-sdk';
import useWeb3 from "./useWeb3";
import './nav.css';


const getProviderOptions = () => {
    // const infuraId = "00ca1859789d4b40bce01f4104844224";
    const providerOptions = {
        walletconnect: {
            package: WalletConnect,
            options: {
                network: "binance",
                rpc: {
                    56: "https://bsc-dataseed1.binance.org"
                }
            }
        },
        coinbasewallet: {
            package: CoinbaseWalletSDK, // Required
            options: {
                appName: "Red Giant Staking", // Required
                infuraId: "", // Required
                rpc: "https://bsc-dataseed1.binance.org", // Optional if `infuraId` is provided; otherwise it's required
                chainId: 56, // Optional. It defaults to 1 if not provided
                darkMode: false // Optional. Use dark theme, defaults to false
            }
        },
        "custom-binancechainwallet": {
            display: {
                logo: "https://lh3.googleusercontent.com/rs95LiHzLXNbJdlPYwQaeDaR_-2P9vMLBPwaKWaQ3h9jNU7TOYhEz72y95VidH_hUBqGXeia-X8fLtpE8Zfnvkwa=w128-h128-e365-rj-sc0x00ffffff",
                name: "Binance Chain Wallet",
                description: "Connect to your Binance Chain Wallet"
            },
            package: true,
            connector: async () => {
                let provider = null;
                if (typeof window.BinanceChain !== 'undefined') {
                    provider = window.BinanceChain;
                    try {
                        const account = await provider.request({ method: 'eth_requestAccounts' })
                        console.log(account[0]);
                    } catch (error) {
                        throw new Error("User Rejected");
                    }
                } else {
                    throw new Error("No Binance Chain Wallet found");
                }
                return provider;
            }
        },
    };
    return providerOptions;
};


export const Nav = () => {
    const location = useLocation();
    const { web3, setWeb3, walletAddress, setWalletAddress } = useWeb3();

    const web3Modal = new Web3Modal({
        network: "Binance",
        cacheProvider: true,
        providerOptions: getProviderOptions(),
    });

    useEffect(() => {
        if (web3Modal.cachedProvider) {
            resetApp();
        }
    }, []);

    const subscribeProvider = async (provider) => {
        if (!provider.on) {
            return;
        }
        provider.on("close", () => resetApp());
        provider.on("accountsChanged", async (accounts) => {
            console.log(accounts[0]);
            setWalletAddress(accounts[0]);
            // setWeb3Data({ ...web3Data, address: accounts[0] });
            // await this.getAccountAssets();
        });
        provider.on("chainChanged", async (chainId) => {
            // const { web3 } = web3Data;
            // const networkId = await web3.eth.net.getId();
            // setWeb3Data({ ...web3Data, chainId: chainId, networkId: networkId });
            // await this.getAccountAssets();
        });

        provider.on("networkChanged", async (networkId) => {
            // const { web3 } = web3Data;
            // const chainId = await web3.eth.chainId();
            // setWeb3Data({ ...web3Data, chainId: chainId, networkId: networkId });
            // await this.getAccountAssets();
        });
    };

    const resetApp = async () => {
        // const { web3 } = web3Data;
        if (web3 && web3.currentProvider && web3.currentProvider.close) {
            await web3.currentProvider.close();
        }
        setWalletAddress("");
        await web3Modal.clearCachedProvider();
        // setWeb3Data({ ...INITIAL_STATE });
    };

    const onConnect = async () => {
        try {
            const provider = await web3Modal.connect();
            await subscribeProvider(provider);
            await provider.enable();
            setWeb3(new Web3(provider));
            const chainId = await provider.request({ method: 'eth_chainId' });
            const binanceTestChainId = '0x38'
            if (chainId === binanceTestChainId) {
                console.log("Bravo!, you are on the correct network");
            } else {
                try {
                    await provider.request({
                        method: 'wallet_switchEthereumChain',
                        params: [{ chainId: '0x38' }],
                    });
                    console.log("You have succefully switched to Binance main network")
                } catch (switchError) {
                    // This error code indicates that the chain has not been added to MetaMask.
                    if (switchError.code === 4902) {
                        try {
                            await provider.request({
                                method: 'wallet_addEthereumChain',
                                params: [
                                    {
                                        chainId: '0x38',
                                        chainName: 'Binance Smart Chain',
                                        rpcUrls: ['https://bsc-dataseed1.binance.org'],
                                        blockExplorerUrls: ['https://bscscan.com/'],
                                        nativeCurrency: {
                                            symbol: 'BNB',
                                            decimals: 18,
                                        }
                                    }
                                ]
                            });
                        } catch (addError) {
                            console.log(addError);
                            // alert(addError);
                        }
                    }
                    // alert("Failed to switch to the network")
                    return;
                }
            }

            const accounts = await provider.request({ method: 'eth_requestAccounts' });
            const account = accounts[0];
            setWalletAddress(account);
        } catch (e) {
            console.log(e);
        }
    };

    function ellipseAddress(
        address = "",
        width = 10
    ) {
        return `${address.slice(0, width)}...${address.slice(-width)}`;
    }

    return (
        <header className="nav-header">
            <nav className="navbar navbar-light navbar-expand-md py-3 nav-background">
                <div className="container">
                    <Link className="navbar-brand d-flex align-items-center" to="/">
                        <span className="bs-icon-sm bs-icon-rounded bs-icon-primary d-flex justify-content-center align-items-center me-2 bs-icon nav-banner">
                            <svg
                                xmlns="http://www.w3.org/2000/svg" viewBox="0 -32 576 576" width="1em" height="1em" fill="currentColor" className="color-orange">
                                <path
                                    d="M256 16C256 9.018 260.5 2.841 267.2 .7414C273.9-1.358 281.1 1.105 285.1 6.826L509.1 326.8C512.5 331.7 512.9 338.1 510.2 343.4C507.4 348.7 501.1 352 496 352H272C263.2 352 256 344.8 256 336V16zM212.1 96.54C219.1 98.4 224 104.7 224 112V336C224 344.8 216.8 352 208 352H80C74.3 352 69.02 348.1 66.16 344C63.3 339.1 63.28 333 66.11 328.1L194.1 104.1C197.7 97.76 205.1 94.68 212.1 96.54V96.54zM5.718 404.3C2.848 394.1 10.52 384 21.12 384H554.9C565.5 384 573.2 394.1 570.3 404.3L566.3 418.7C550.7 473.9 500.4 512 443 512H132.1C75.62 512 25.27 473.9 9.747 418.7L5.718 404.3z">
                                </path>
                            </svg>
                        </span>
                        <span style={{ color: "var(--bs-orange)", fontFamily: "'Alfa Slab One', serif" }}>
                            PooSail NFT'S
                        </span>
                    </Link>
                    <button data-bs-toggle="collapse" className="navbar-toggler nav-button" data-bs-target="#navcol-1">
                        <span
                            className="visually-hidden">Toggle navigation</span><span className="navbar-toggler-icon"
                                style={{ color: "var(--bs-white)" }}></span></button>
                    <div className="collapse navbar-collapse" id="navcol-1">
                        <ul className="navbar-nav me-auto"></ul>
                        <ul className="navbar-nav">
                            <li className="nav-item">
                                <Link to="/" className={`nav-link nav-tab ${location.pathname === "/" ? "active" : ""}`}>Mint</Link>
                            </li>
                        </ul>
                        <ul className="navbar-nav">
                            <li className="nav-item">
                                <Link to="/info" className={`nav-link nav-tab ${location.pathname === "/info" ? "active" : ""}`}>INFO</Link>
                            </li>
                        </ul>
                        <ul className="navbar-nav">
                            <li className="nav-item">
                                <Link to="/gallery" className={`nav-link nav-tab ${location.pathname === "/gallery" ? "active" : ""}`}>Gallery</Link>
                            </li>
                        </ul>
                        <button className="btn btn-primary connect-wallet" data-bss-hover-animate="pulse" type="button" onClick={walletAddress === "" ? onConnect : resetApp} >{walletAddress === "" ? "Connect Wallet" : ellipseAddress(walletAddress, 7)}</button>
                    </div>
                </div>
            </nav>
        </header>
    );
};