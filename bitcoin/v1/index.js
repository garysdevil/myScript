const bitcoin = require('bitcoinjs-lib');
const bip39 = require('bip39');
const bip32 = require('bip32');
const tinysecp = require('tiny-secp256k1');

// 初始化ECC库
bitcoin.initEccLib(tinysecp);

/**
 * 生成比特币Taproot地址
 * @param {string} mnemonic 助记词
 * @param {string} networkType 网络类型 ('mainnet' 或 'testnet')
 * @returns {Promise<string>} 生成的Taproot地址
 */
async function generateTaprootAddress(mnemonic, networkType) {
    const network = networkType === 'mainnet' ? bitcoin.networks.bitcoin : bitcoin.networks.testnet;
    // 生成根密钥
    const seed = await bip39.mnemonicToSeed(mnemonic);
    const root = bip32.fromSeed(seed, network);

    // 生成派生路径 (m/86'/0'/0'/0/0)
    const path = "m/86'/0'/0'/0/0"; // 0 表示主网
    const child = root.derivePath(path);

    // 获取内部公钥
    const internalPubkey = child.publicKey.slice(1, 33); // Taproot内部公钥是压缩公钥的后32字节

    // 生成Taproot地址
    const { address } = bitcoin.payments.p2tr({
        internalPubkey,
        network,
    });

    return address;
}

/**
 * 循环生成比特币助记词和Taproot地址
 * @param {number} count 生成地址的数量
 */
async function generateMneAddr(count) {
  for (let id = 1; id <= count; id++) {
    const mnemonic = bip39.generateMnemonic(); // 自动生成助记词
    const testAddr = await generateTaprootAddress(mnemonic, 'testnet');
    const mainAddr = await generateTaprootAddress(mnemonic, 'mainnet');
    const output = JSON.stringify({id, mnemonic, testAddr, mainAddr})
    console.log(output);
  }
}

async function main() {
    const args = process.argv.slice(2); // 获取参数进i个数组里
    const mnemonic = args[0];
    if (mnemonic == 'auto') {
      const count = args[1] ? parseInt(args[1], 10) : 10; 
      await generateMneAddr(count);
    } else if (!bip39.validateMnemonic(mnemonic)) {
        console.error('请输入有效的助记词');
        process.exit(1);
    }else {
      const testAddress = await generateTaprootAddress(mnemonic, 'testnet');
      const mainAddress = await generateTaprootAddress(mnemonic, 'mainnet');
      console.log({testAddress, mainAddress});
    }
}

main().catch(console.error);