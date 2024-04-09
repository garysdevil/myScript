const { mnemonicToMiniSecret, cryptoWaitReady, encodeAddress } = require('@polkadot/util-crypto');
const { Keyring } = require('@polkadot/api');  // Importing Keyring from @polkadot/api

// Function to generate a CESS wallet address from a seed phrase
// the CESS network prefix is 11330
// the Polkadot network prefix is 42
async function generateCessAddressFromSeed(seedPhrase, prefix = 11330) {
    await cryptoWaitReady();  // Ensure cryptographic libraries are initialized

    // Convert the seed phrase to a mini secret key
    const seed = mnemonicToMiniSecret(seedPhrase);

    // Create a keyring instance with the specified type
    const keyring = new Keyring({ type: 'sr25519' });
    const pair = keyring.addFromSeed(seed);

    // Encode the public key into the SS58 format
    const ss58Address = encodeAddress(pair.publicKey, prefix);

    return ss58Address;
}

// Function to generate addresses from multiple seed phrases
async function generateMultipleAddresses(seedPhrases) {
    for (const seedPhrase of seedPhrases) {
        const address = await generateCessAddressFromSeed(seedPhrase);
        console.log('1. -');
        console.log('    1.', address);
        console.log('    2.', seedPhrase);
    }
}

// Execute the address generation function
(async () => {
    const seedPhrases = [
        "种子1",
        "种子2",
    ];

    try {
        await generateMultipleAddresses(seedPhrases);
    } catch (error) {
        console.error('Error generating addresses:', error);
    }
})();

