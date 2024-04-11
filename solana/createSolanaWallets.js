const { Keypair } = require('@solana/web3.js');
const bip39 = require('bip39');
const { derivePath } = require('ed25519-hd-key');

const generateWallet = async () => {
  const mnemonic = bip39.generateMnemonic(); // Generate a random mnemonic
  const seed = await bip39.mnemonicToSeed(mnemonic); // Convert mnemonic to seed
  const { key } = derivePath("m/44'/501'/0'/0'", seed.toString('hex')); // Solana's BIP44 path
  const keypair = Keypair.fromSeed(key.slice(0, 32)); // Create a keypair from the first 32 bytes of the seed

  return {
    mnemonic,
    address: keypair.publicKey.toString(),
  };
};

const createWallets = async (numberOfWallets) => {
  const wallets = [];

  for (let i = 0; i < numberOfWallets; i++) {
    wallets.push(await generateWallet());
  }

  return wallets;
};

const main = async () => {
  const numberOfWallets = 100; // Change this number to create more or fewer wallets
  const wallets = await createWallets(numberOfWallets);
  wallets.forEach((wallet, index) => {
    console.log(`Address: ${wallet.address}  Seed: ${wallet.mnemonic}`);
  });
};

main().catch(console.error);
