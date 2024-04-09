const { ApiPromise, WsProvider, Keyring } = require('@polkadot/api');

const delay = (time) => new Promise((resolve) => setTimeout(resolve, time));

// Async function to perform token transfer
async function transferCessToken(senderSeed, receiverAddress, amount) {
    // Create a WebSocket connection to the CESS blockchain
    // const provider = new WsProvider('wss://your-cess-node-url.com');
    const provider = new WsProvider('wss://testnet-rpc0.cess.cloud/ws/');
    const api = await ApiPromise.create({ provider });

    // Wait for the API to connect and load metadata
    await api.isReady;

    // Create a keyring and add sender account from the seed
    const keyring = new Keyring({ type: 'sr25519' });
    const sender = keyring.addFromUri(senderSeed);

    // Using BigInt for the amount
    const bigAmount = BigInt(amount); // Convert the large number to a BigInt

    // Create a transfer transaction and sign it
    const transfer = api.tx.balances.transfer(receiverAddress, amount);
    const hash = await transfer.signAndSend(sender);

    console.log(`Transaction successful with hash: ${hash.toString()}`);
    // Disconnect from the WS provider
    await provider.disconnect();
}

// Async function to check the balance of an account
async function checkBalance(accountAddress) {
    // Create a WebSocket connection to the CESS blockchain
    const provider = new WsProvider('wss://testnet-rpc0.cess.cloud/ws/');
    const api = await ApiPromise.create({ provider});

    // Wait for the API to connect and load metadata
    await api.isReady;

    // Query the balance
    const { data: { free: balance } } = await api.query.system.account(accountAddress);

    console.log(`Balance for ${accountAddress} is ${balance.toHuman()} CESS`);

    // Disconnect from the WS provider
    await provider.disconnect();
}


// (async () => {
//     const senderSeed = '种子';
//     const receiverAddress = '地址';
//     // const amount = 100000000; // Amount is in the smallest unit of the token
//     const amount = "48100000000000000000000"; // 48100 String input to avoid JS Number limitations
//     try {
//         await transferCessToken(senderSeed, receiverAddress, amount);
//         await checkBalance(receiverAddress);
//     } catch (error) {
//         console.error('~~~~~', error);
//     }
// })();

(async () => {
    const senderSeed = '种子';
    const amount = "48100000000000000000000"; // String input to avoid JS Number limitations
    
    const receiverAddressArr = []

    for (let i = 0; i < receiverAddressArr.length; i += 1) {
        try {
            console.log(i);
            const receiverAddress = receiverAddressArr[i];
            // await transferCessToken(senderSeed, receiverAddress, amount);
            // await delay(2000);
            await checkBalance(receiverAddress);
            
        } catch (error) {
            console.error(receiverAddress, '~~~~~', error);
        }
    }

})();
