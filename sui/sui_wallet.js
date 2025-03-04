import { getFullnodeUrl, SuiClient } from '@mysten/sui/client';
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';
import { generateMnemonic } from '@scure/bip39';
import { wordlist } from '@scure/bip39/wordlists/english';
import { appendFileSync, writeFileSync, readFileSync } from 'fs';
import { join } from 'path';

/**
 * 配置常量
 */
const CONFIG = {
    OUTPUT_FILE: 'local_wallet.json',
    ENTROPY_BITS: 128, // 128 位熵生成 12 词助记词
    NETWORK: 'devnet', // Sui 网络类型
};

/**
 * 生成单个 Sui 钱包
 * @returns {Object} 包含助记词、私钥、公钥和地址的钱包信息
 */
function generateWallet() {
    const mnemonic = generateMnemonic(wordlist, CONFIG.ENTROPY_BITS);
    const keypair = Ed25519Keypair.deriveKeypair(mnemonic);
    return {
        mnemonic,
        privateKey: keypair.getSecretKey(),
        publicKey: Buffer.from(keypair.getPublicKey().toRawBytes()).toString('hex'),
        address: keypair.getPublicKey().toSuiAddress(),
    };
}

/**
 * 检查单个 Sui 地址余额
 * @param {string} address - Sui 地址
 * @returns {Promise<number>} 以 SUI 为单位的余额
 */
async function checkBalance(address) {
    const client = new SuiClient({ url: getFullnodeUrl(CONFIG.NETWORK) });
    try {
        const balance = await client.getBalance({ owner: address });
        return Number(balance.totalBalance) / 10 ** 9;
    } catch (error) {
        throw new Error(`地址 ${address} 查询失败: ${error.message}`);
    }
}

/**
 * 顺序写入内容到文件，并处理写入错误
 * @param {string} filePath - 文件路径
 * @param {string} content - 要写入的内容
 * @param {string} prefix - 日志前缀
 */
function writeContentToFile(filePath, content, prefix = '') {
    try {
        appendFileSync(filePath, `${content}\n`, 'utf8');
        console.log(`${prefix}已写入: ${filePath}`);
    } catch (error) {
        console.error(`${prefix}写入失败: ${error.message}`);
    }
}

/**
 * 批量生成钱包并顺序写入文件，支持指定序列范围
 * @param {Object} options - 配置选项
 * @param {number} [options.startSeq=1] - 起始序列号
 * @param {number} [options.endSeq=1] - 结束序列号
 * @param {string} [options.outputFile=CONFIG.OUTPUT_FILE] - 输出文件路径
 * @param {boolean} [options.clearFile=true] - 是否清空文件
 */
function batchGenerateWallet({
    startSeq = 1,
    endSeq = 1,
    outputFile = CONFIG.OUTPUT_FILE,
    clearFile = true,
} = {}) {
    const filePath = join(process.cwd(), outputFile);
    console.log(`开始生成钱包，从序列 ${startSeq} 到 ${endSeq}，写入 ${filePath}...`);

    // 清空文件（若 clearFile 为 true）
    if (clearFile) {
        writeFileSync(filePath, '', 'utf8');
    }

    for (let seq = startSeq; seq <= endSeq; seq++) {
        const wallet = generateWallet();
        const json = JSON.stringify({
            seq,
            mnemonic: wallet.mnemonic,
            address: wallet.address,
            privateKey: wallet.privateKey,
        });
        writeContentToFile(filePath, json, `[钱包 ${seq}] `);
    }
    console.log(`钱包生成完成，从 ${startSeq} 到 ${endSeq}`);
}

/**
 * 批量检查文件中指定范围的钱包地址余额
 * @param {Object} options - 配置选项
 * @param {number} [options.startSeq=1] - 起始序列号
 * @param {number} [options.endSeq=Infinity] - 结束序列号
 * @param {string} [options.filePath=CONFIG.OUTPUT_FILE] - 文件路径
 * @returns {Promise<Object[]>} 返回余额检查结果数组
 */
async function batchCheckBalances({
    startSeq = 1,
    endSeq = Infinity,
    filePath = join(process.cwd(), CONFIG.OUTPUT_FILE),
} = {}) {
    console.log(`开始检查 ${filePath} 中序列 ${startSeq} 到 ${endSeq} 的钱包余额...`);

    // 读取文件内容
    let wallets;
    try {
        const content = readFileSync(filePath, 'utf8');
        wallets = content
            .trim()
            .split('\n')
            .map(line => JSON.parse(line))
            .filter(wallet => wallet.seq >= startSeq && wallet.seq <= endSeq); // 过滤指定范围
    } catch (error) {
        console.error(`读取文件 ${filePath} 失败: ${error.message}`);
        return [];
    }

    // 并行检查余额
    const balancePromises = wallets.map(async (wallet) => {
        const seq = wallet.seq;
        const address = wallet.address;
        try {
            const balance = await checkBalance(address);
            console.log(`[钱包 ${seq}] 地址 ${address} 余额: ${balance} SUI`);
            return { seq, address, balance };
        } catch (error) {
            console.error(`[钱包 ${seq}] ${error.message}`);
            return { seq, address, balance: null };
        }
    });

    try {
        const results = await Promise.all(balancePromises);
        console.log(`余额检查完成，从序列 ${startSeq} 到 ${endSeq}`);
        return results;
    } catch (error) {
        console.error("批量检查余额出错:", error.message);
        return [];
    }
}

// 执行主逻辑
(async () => {
    try {
        // 生成钱包（示例：生成序列 1 到 10）
        batchGenerateWallet({ startSeq: 301, endSeq: 1000 });

        // // 批量检查余额（示例：检查序列 1 到 5）
        // await batchCheckBalances({ startSeq: 1, endSeq: 5 });
    } catch (error) {
        console.error("程序执行出错:", error.message);
        process.exit(1);
    }
})();