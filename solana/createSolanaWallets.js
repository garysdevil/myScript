const { Keypair } = require('@solana/web3.js');
const bip39 = require('bip39');
const { derivePath } = require('ed25519-hd-key');

const generateWallet = async () => {
  const mnemonic = bip39.generateMnemonic(); // Generate a random mnemonic
  const seed = await bip39.mnemonicToSeed(mnemonic); // Convert mnemonic to seed
  const { key } = derivePath("m/44'/501'/0'/0'", seed.toString('hex')); // Solana's BIP44 path
  const keypair = Keypair.fromSeed(key.slice(0, 32)); // Create a keypair from the first 32 bytes of the seed

  return {
    address: keypair.publicKey.toString(),
    seed: mnemonic, // Rename to match "seed"
  };
};

const main = async () => {
  const numberOfWallets = 800; // Change this number to create more or fewer wallets

  for (let i = 101; i <= numberOfWallets; i++) {
    const wallet = await generateWallet();
    const formattedOutput = JSON.stringify({ index: i, ...wallet }, null, 0)
    console.log(formattedOutput);
  }
};

main().catch(console.error);
