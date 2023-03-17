// https://filadoge.fun/
// 使用说明教程
// 下载依赖 cd myjs/evm && npm i
// 执行脚本 cd src/test && node test_FilaDoge.js

/* eslint-disable no-unused-vars */
import * as ethers from 'ethers';
import fs from 'fs';
import ini from 'ini';

import * as ethers_online from '../ethers/ethers_online.js';
import * as ethers_offline from '../ethers/ethers_offline.js';

const config = ini.parse(fs.readFileSync('../conf/.local.config.ini', 'utf-8'));
const filecoinRpcUrl = config.fullnode.filecoin_rpc_url;

const ethersProvider = new ethers.providers.JsonRpcProvider(filecoinRpcUrl);

function sleep(ms) {
    // eslint-disable-next-line no-promise-executor-return
    return new Promise((resolve) => setTimeout(() => resolve(), ms));
}

// mint
const mintCoin = async (walletAddress, walletPrivateKey) => {
    const FilaDogeAddress = '0x7B90337f65fAA2B2B8ed583ba1Ba6EB0C9D7eA44';
    const FilaDogeABI = [
        'function mint(address, address) external returns (uint, uint)',
        'function inviteeRewardReceived(address) external view returns (uint)',
        'function inviterRewardReceived(address) external view returns (uint)',
    ];

    const conConnect = new ethers.Contract(FilaDogeAddress, FilaDogeABI, ethersProvider);

    // connect to a Signer
    const wallet = ethers_online.initWallet(ethersProvider, walletPrivateKey);
    const conWithSigner = conConnect.connect(wallet);

    const estimateGas = await conWithSigner.estimateGas.mint('0xfeda2DCb016567DEb02C3b59724cf09Dbc41A64D', walletAddress);
    console.log('estimateGas:', estimateGas.toNumber());
    const overrides = {
        gasLimit: estimateGas,
        maxPriorityFeePerGas: ethers.utils.parseUnits('2', 'gwei'),
    };

    const tx = await conWithSigner.mint('0xfeda2DCb016567DEb02C3b59724cf09Dbc41A64D', walletAddress, overrides);
    console.log('tx', tx.hash);
};

// 转出钱包的余额
const transfer = async (walletPrivateKey, toAddress, toBalance = '0.4') => {
    const maxFeePerGas_gwei = '3';
    const maxPriorityFeePerGas_gwei = '1.5';

    // 轮训直到 maxFeePerGas_gwei 大于 baseFeePerGas_gwei
    const jsonStr = await ethers_online.loopGetTargetGasPrice(ethersProvider, maxFeePerGas_gwei, 15000);

    // 获取余额
    // const result = await ethers_online.getBalance(ethersProvider, walletAddress);
    // const balance_ether_obj = ethers.utils.parseEther(JSON.parse(result).balance);

    // const fee_gwei = 5532828 * maxFeePerGas_gwei;
    const fee_gwei = 5532828 * Number(maxFeePerGas_gwei) * 3; // 留3倍的gas在钱包里，否FEVM转账失败

    // 设置转出的金额
    const fee_ether_obj = ethers.utils.parseUnits(fee_gwei.toString(), 'gwei');
    // const transfer_ether_obj = balance_ether_obj.sub(fee_ether_obj);
    const transfer_ether_obj = fee_ether_obj.add(ethers.utils.parseUnits(toBalance, 'ether'));
    const value_ether = ethers.utils.formatEther(transfer_ether_obj).toString();
    console.log('转出的金额(ETH)=', value_ether, 'maxFeePerGas_gwei=', maxFeePerGas_gwei);
    // 转出金额
    const ethWallet = new ethers.Wallet(walletPrivateKey).connect(ethersProvider);
    await ethers_online.transferExact(ethWallet, toAddress, value_ether, false, maxFeePerGas_gwei, maxPriorityFeePerGas_gwei);
};

(async () => {
    await ethers_online.getProviderStatus(ethersProvider);
    console.log(await ethers_online.getNetGasPrice(ethersProvider));

    // 1. 批量创建钱包
    // 生成100个钱包，记得备份，重新执行，之前的钱包会被覆盖
    const walletListPath = './local.filecoin.wallet.json';
    ethers_offline.generateMultiEthWallet(100, walletListPath);

    const data = fs.readFileSync(walletListPath, 'utf8');
    const dataArrObj = JSON.parse(data);

    // 2. 批量转账进各个钱包
    const originWalletID = 0; // 设置从哪个钱包进行转出
    const balanceFIL = await ethers_online.getBalance(ethersProvider, dataArrObj[originWalletID].address);
    console.log(balanceFIL);
    for (let i = 0; i < 100; i += 1) {
        console.log(i);
        await transfer(dataArrObj[originWalletID].private_key, dataArrObj[i].address);
        sleep(1000);
    }

    sleep(60000); // 等待 1 分钟

    // 3. 批量执行mint操作
    for (let i = 0; i < 100; i += 1) {
        console.log(i);
        await mintCoin(dataArrObj[i].address, dataArrObj[i].private_key);
        sleep(1000);
    }
})();
