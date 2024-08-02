import * as ethers from 'ethers';
import fs from 'fs';
import * as bip39 from 'bip39';

// 生成一个钱包，返回钱包的地址，私钥，助记词
const create12WordsEVMWallet = (id) => {
    // 生成钱包 方式一
    // let privateKey = ethers.utils.randomBytes(32) // 生成32个随机字节
    // // console.log(Buffer.from(privateKey).toString('hex')) // 转成16进制字符串
    // let wallet = new ethers.Wallet(privateKey)

    // 生成钱包 方式二
    const wallet = ethers.Wallet.createRandom();

    // 返回钱包地址和私钥
    const { address } = wallet;
    const private_key = wallet.privateKey;
    const { mnemonic } = wallet;
    // const { phrase } = wallet.mnemonic;
    const json = JSON.stringify({ id, address, private_key, mnemonic });
    return json;
};

const create24WordsEVMWallet = (id) => {
    // 生成24位助记词
    const mnemonic = bip39.generateMnemonic(256); // 256位熵对应24个助记词
    // 从助记词创建钱包
    const wallet = ethers.Wallet.fromMnemonic(mnemonic);
    const { address } = wallet;
    const private_key = wallet.privateKey;
    const json = JSON.stringify({ id, address, private_key, mnemonic });
    return json;
};

// 批量生成钱包，写入指定的文件内
const generateMultiEthWallet = (num, path) => {
    fs.writeFileSync(path, '[');
    for (let i = 0; i < num; i += 1) {
        const wallet_json_str = create12WordsEVMWallet();
        // console.log(wallet_json_str);
        fs.appendFileSync(path, wallet_json_str);
        if (i < num - 1) {
            fs.appendFileSync(path, ',\n');
        }
    }
    fs.appendFileSync(path, '\n]');
};
// 读取的文件的方式
// const data = fs.readFileSync(path, 'utf8');
// const data_arr_obj = JSON.parse(data);
// console.log("address",data_arr_obj[0].address)
// console.log("private_key",data_arr_obj[0].private_key)

export { create12WordsEVMWallet, create24WordsEVMWallet, generateMultiEthWallet };

// BigNumber 转为
// toHexString() → String // Returns the value of BigNumber as a base-16, 0x-prefixed DataHexString.
// toNumber() → num // Returns the value of BigNumber as a JavaScript value.
// toString() → String // Returns the value of BigNumber as a base-10 string.