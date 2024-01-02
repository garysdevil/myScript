// mv ../conf/config.ini ../conf/.local.config.ini
// 运行方式 config_path='../conf/.local.config.ini', wallet_path='../conf/wallet.json' node test_wallet_check.js

import * as ethers from 'ethers';
import fs from 'fs';
import ini from 'ini';

import * as ethers_online from '../ethers/ethers_online.js';
import * as abi from '../ethers/abi.js';
import * as requestUtil from '../utils/request.js';
import * as myutils from '../utils/utils.js';

const config_path = process.env.config_path || '../conf/.local.config.ini';
const wallet_path = process.env.wallet_path || '../conf/.local.wallet.json';
console.log('config_path=', config_path, '\nwallet_path=', wallet_path);

const config = ini.parse(fs.readFileSync(config_path, 'utf-8'));

const rpc_url = config.fullnode.sepolia_rpc_url; // 选择要接入的网络
const ethersProvider = new ethers.providers.JsonRpcProvider(rpc_url);

const wallet_data = fs.readFileSync(wallet_path, 'utf8');
const wallet_arr_obj = JSON.parse(wallet_data);

const { arbitrum_api_key, polygon_api_key } = config.explorer;

const getERC20Balance = async () => {
    // 通过全节点接口，批量查询EVM网络余额
    let token_total = 0;
    for (let i = 0; i < 100; i += 1) {
        const { address } = wallet_arr_obj[i];
        const result = await ethers_online.getBalance(ethersProvider, address);
        const jsonObj = JSON.parse(result);
        jsonObj.seq = i + 1;
        // console.log(JSON.stringify(jsonObj));
        token_total += parseFloat(jsonObj.balance);
        console.log(jsonObj.balance);
        // console.log(i + 1, jsonObj.balance, ', nonce+1=', await ethersProvider.getTransactionCount(address));
    }
    console.log('总额=', token_total, 'Token');
};

const getERC20BalanceByExplorer = async () => {
    // 通过区块链浏览器接口，批量查询arbitrum网络余额
    let arbitrum_total_ether = 0;
    for (let i = 0; i < 100; i += 1) {
        const { address } = wallet_arr_obj[i];
        const url = `https://api.arbiscan.io/api?module=account&action=balance&address=${address}&tag=latest&apikey=${arbitrum_api_key}`;
        const result = await requestUtil.sendGetRequest(url);

        const balance_eth = result.result / 1000000000000000000;
        const seq = i + 1;
        const jsonObj = { balance_eth, address, seq };
        console.log(JSON.stringify(jsonObj));
        arbitrum_total_ether += balance_eth;
        myutils.delay(1000);
    }
    console.log('arbitrum网络', arbitrum_total_ether, 'ETH');
};

const getNFTBalance = async (nft_contract_address) => {
    for (let i = 0; i < 110; i += 1) {
        const { address } = wallet_arr_obj[i];
        const rollupOATContract = new ethers.Contract(nft_contract_address, abi.erc721, ethersProvider);
        const numB = await rollupOATContract.balanceOf(address);
        console.log(i + 1, numB.toNumber());
    }
};

const getNFTTXNum = async (nft_contract_address) => {
    // 查看polygon网络，指定时间内的收到指定类型的NFT数量
    for (let i = 0; i < 100; i += 1) {
        const { address } = wallet_arr_obj[i];
        const startblock = 48000000; // Sep-26-2023 16:38:59
        const url = `https://api.polygonscan.com/api?module=account&action=tokennfttx&contractaddress=${nft_contract_address}&address=${address}&startblock=${startblock}&endblock=99999999&page=1&offset=100&sort=asc&apikey=${polygon_api_key}`;
        const response = await requestUtil.sendGetRequest(url);
        // for (const tx in response.result){};
        console.log(response.result.length);
        myutils.delay(1000);
    }
}

(async () => {
    // AVAX网络合约地址
    // const nft_contract_address = '0xf9ad3f5eab7e9214387c75d58ce40d3a6d05b930' // Rollux项目galax上OAT合约
    // polygon网络合约地址
    // const nft_contract_address = '0x5d666f215a85b87cb042d59662a7ecd2c8cc44e6'; // Token Galxe OAT 合约  https://polygonscan.com/token/0x5d666f215a85b87cb042d59662a7ecd2c8cc44e6
    // const nft_contract_address = '0x767348071c751525198b09c453d6d267ac47cf6f'; // zkLink奥德赛五 Summer Tour Multi-Chain Week OAT 合约
    // const nft_contract_address = '0x89acaf092909d5e20a18fd6b4a866e3674495b9e'; // zkLink Mystery Box 合约

    // await getERC20BalanceByExplorer();
    // await getNFTBalance(nft_contract_address);
    // await getNFTTXNum(nft_contract_address);

    await ethers_online.getProviderStatus(ethersProvider);
    await getERC20Balance();
})();
