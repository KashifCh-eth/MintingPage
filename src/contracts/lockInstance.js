import Web3 from 'web3'
import abi from './abi'
import * as Web3Utils from 'web3-utils';
import getContractsAddress from './contractsAddress';

const provider = () => {
    // 1. Try getting newest provider
    const { ethereum } = window
    if (ethereum) return ethereum

    // 2. Try getting legacy provider
    const { web3 } = window
    if (web3 && web3.currentProvider) return web3.currentProvider
}

let contractInstance


function toPlainString(num) {
    return ('' + +num).replace(/(-?)(\d*)\.?(\d*)e([+-]\d+)/,
        function (a, b, c, d, e) {
            return e < 0
                ? b + '0.' + Array(1 - e - c.length).join(0) + c + d
                : b + c + d + Array(e - d.length + 1).join(0);
        });
}

const BSC_URL = "https://bsc-dataseed1.binance.org";

if (provider()) {
    const web3 = new Web3(provider())
    const web3_read = new Web3(new Web3.providers.HttpProvider(BSC_URL));
    contractInstance = web3.eth.net.getId().then(id => {
        const address = getContractsAddress(id)
        const contractInstance = new web3.eth.Contract(abi, address)
        const readContract = new web3_read.eth.Contract(abi, address);
        return {
            async mint(count, sender) {
                try {
                    const res = await contractInstance.methods.mint(count).send({
                        'from': sender
                    })
                    return res;
                } catch (e) {
                    console.log(e)
                }
            },
            async claimReward(sender) {
                try {
                    const res = await contractInstance.methods.claimRewards().send({
                        'from': sender
                    })
                    return res;
                } catch (e) {
                    console.log(e)
                }
            },
            async setApprovalForAll(sender) {
                try {
                    const res = await contractInstance.methods.setApprovalForAll(process.env.REACT_APP_STAKING_ADDRESS, true).send({
                        'from': sender
                    })
                    return res;
                } catch (e) {
                    console.log(e)
                }
            },
            async totalSupply() {
                try {
                    const supply = await readContract.methods.totalSupply().call();
                    return supply;
                } catch (e) {
                    console.log(e);
                }
            },
            async getMintCost() {
                try {
                    const cost = await readContract.methods.cost().call();
                    return cost;
                } catch (e) {
                    console.log(e);
                }
            },
            async getMintReward(wallet) {
                try {
                    const cost = await contractInstance.methods.getReflectionBalances(wallet).call();
                    return cost;
                } catch (e) {
                    console.log(e);
                }
            },
            async getUserNFTs(address) {
                try {
                    console.log(address);
                    const ids = await contractInstance.methods.getTokenIds(address).call();
                    return ids;
                } catch (e) {
                    console.log(e);
                }
            },
            async getTokenURL(id) {
                try {
                    const url = await readContract.methods.tokenURI(id).call();
                    return url;
                } catch (e) {
                    console.log(e);
                }
            }
        }
    })
}

export default contractInstance
