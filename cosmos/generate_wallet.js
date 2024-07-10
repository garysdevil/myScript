const { DirectSecp256k1HdWallet } = require('@cosmjs/proto-signing');
const bip39 = require('bip39');

async function generateWallets(mnemonic) {
  // 如果助记词为空，则生成新的助记词
  if (!mnemonic) {
    mnemonic = bip39.generateMnemonic();
  }

  // 使用助记词生成 Allora 网络的钱包
  const alloraWallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, {
    prefix: 'allo', // Allora 网络的地址前缀
  });

  // 使用助记词生成 Cosmos Hub 网络的钱包
  const cosmosHubWallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, {
    prefix: 'cosmos', // Cosmos Hub 网络的地址前缀
  });

  // 获取钱包账户信息
  const [alloraAccount] = await alloraWallet.getAccounts();
  const [cosmosHubAccount] = await cosmosHubWallet.getAccounts();

  // 输出助记词和地址
  console.log('Mnemonic:', mnemonic);
  console.log('Allora Network Address:', alloraAccount.address);
  console.log('Cosmos Hub Network Address:', cosmosHubAccount.address);
}

// 从命令行参数获取助记词
const args = process.argv.slice(2);
const mnemonic = args[0] || null;

generateWallets(mnemonic).catch(console.error);
