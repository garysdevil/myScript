import { fetchSubgraphData } from './query.js';

// 获取命令行参数
const name = process.argv[2];

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
fetchSubgraphData(subgraphName)
  .then((results) => {
    console.log('Query completed successfully:', results);
    process.exit(0);
  })
  .catch((error) => {
    console.error('Query failed:', error);
    process.exit(1);
  });