import { subgraphQueryArray } from './graphql.js';
import dotenv from 'dotenv';

// 加载 .env 文件
dotenv.config();

// 从环境变量中提取 API 密钥
const apiKey = process.env.SUBGRAPH_API_KEY;

// 生成配置，支持多个 Subgraph
const configs = subgraphQueryArray.map(({ url }) => ({
  apiKey,
  url,
  headers: {
    Authorization: `Bearer ${apiKey}`,
  },
}));

// 验证配置
configs.forEach((config, index) => {
  if (!config.apiKey || !config.url) {
    throw new Error(`Missing required configuration at index ${index}: SUBGRAPH_API_KEY or url`);
  }
});

export default configs;