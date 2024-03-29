const { mnemonicGenerate } = require('@polkadot/util-crypto');
const { Keyring } = require('@polkadot/keyring');
const { cryptoWaitReady } = require('@polkadot/util-crypto');

const createPolkadotWallets = async (numberOfWallets) => {
  await cryptoWaitReady();
  const keyring = new Keyring({ type: 'sr25519' });
  let wallets = [];

  for (let i = 0; i < numberOfWallets; i++) {
    const mnemonic = mnemonicGenerate();
    const wallet = keyring.addFromMnemonic(mnemonic);
    console.log(`Wallet #${i + 1} Seed: ${mnemonic}`);
    wallets.push({ mnemonic, address: wallet.address });
  }

  return wallets;
};


// Import CESS SDK
const { Common } = require('cess-js-sdk');

const convertToCESSAddresses = async (wallets) => {
  console.log(wallets);
   //.formatAddress(wallets[0].address);
  console.log(Common.formatter);
  // // Initialize CESS SDK - adjust with actual initialization as per SDK docs
  // const cess = new CESSChain();

  // for (const wallet of wallets) {
  //   // Assuming the SDK has a method to convert or utilize a Polkadot address
  //   // This is pseudocode; replace with actual SDK method calls
  //   const cessAddress = await cess.convertAddress(wallet.address);
  //   console.log(`CESS Address for Wallet Seed ${wallet.mnemonic}: ${cessAddress}`);
  // }
};

// Example usage
(async () => {
  const wallets = await createPolkadotWallets(5);
  await convertToCESSAddresses(wallets);
})();
