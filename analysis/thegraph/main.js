import { fetchSubgraphData } from './query.js';

// 获取命令行参数
const name = 'dxterminal';

// 映射命令行输入到 Subgraph 名称
const nameMap = {
  dxterminal: 'dxTerminal',
  all: 'all',
};

// 检查是否提供参数
if (!name) {
  console.error('Error: Please provide a Subgraph name or "all". Example: node start.js dxTerminal');
  process.exit(1);
}

// 转换为标准 Subgraph 名称
const subgraphName = nameMap[name.toLowerCase()];
if (!subgraphName) {
  console.error(`Error: Invalid Subgraph name: ${name}. Valid options: dxTerminal, all`);
  process.exit(1);
}


// 执行查询
(async () => {
  try {
    const results = await fetchSubgraphData(subgraphName);
    console.log(results[0].data.transfers);
    console.log(results[0].data.transfers.length);
  } catch (error) {
    console.error('Query failed:', error);
  }
})();