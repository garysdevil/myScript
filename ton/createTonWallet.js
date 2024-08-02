import TonWeb from "tonweb"
import nacl from "tweetnacl"
import * as bip39 from 'bip39';

// 生成助记词
const generateMnemonic = async () => {
    const mnemonic = bip39.generateMnemonic(256);
    return mnemonic;
};

// 从助记词生成密钥对
const generateKeyPairFromMnemonic = async (mnemonic) => {
    const seed = await bip39.mnemonicToSeed(mnemonic);
    const keyPair = nacl.sign.keyPair.fromSeed(seed.slice(0, 32)); // tweetnacl expects a 32-byte seed
    return keyPair;
};

const generateTonAddress = async (keyPair) => {
    const tonwebInstance = new TonWeb();

    // Create a key pair
    keyPair = keyPair ||  nacl.sign.keyPair();
  
    // Extract the public key from the key pair
    const publicKey = keyPair.publicKey;
    const publicKeyHex = Buffer.from(publicKey).toString("hex");
  
    // Extract the private key from the key pair
    const privateKey = keyPair.secretKey;
    const privateKeyHex = Buffer.from(privateKey).toString("hex");
  
    // Create a wallet using the public key as Uint8Array
    const wallet = tonwebInstance.wallet.create({publicKey});
  
    // Get the wallet address
    const walletAddress = (await wallet.getAddress()).toString(true, true, true);
  
    console.log("Wallet address:", walletAddress);
    console.log("Public key (hex):", publicKeyHex);
    console.log("Private key (hex):", privateKeyHex);
}


(async () => {
    const mnemonic = await generateMnemonic();
    const keyPair = await generateKeyPairFromMnemonic(mnemonic);
    console.log(mnemonic);
    await generateTonAddress();
})();