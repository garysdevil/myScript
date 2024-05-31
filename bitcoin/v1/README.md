```bash
npm init -y
npm install bitcoinjs-lib@6.1.0 bip39@3.0.4 bip32@2.0.6 tiny-secp256k1@2.1.2
```

```bash
# 通过助记词生成比特币Taproot钱包地址
node index.js 助记词
# 生成指定数量的助记词和比特币Taproot钱包地址
node index.js auto 数量 
```