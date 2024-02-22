// Import
import { ApiPromise, WsProvider } from '@polkadot/api';
const main = async () => {
  // Construct API provider
  const wsProvider = new WsProvider('INSERT_WSS_API_ENDPOINT');
  const api = await ApiPromise.create({ provider: wsProvider });

  // Code goes here

  await api.disconnect();
}

main();