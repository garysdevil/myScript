import { request } from 'graphql-request';
import util from 'util';
import configs from './config.js';
import { subgraphQueryArray } from './graphql.js';

async function fetchSubgraphData(name) {
  try {
    let queriesToExecute;

    // 根据 name 参数选择要执行的查询
    if (name === 'all') {
      queriesToExecute = subgraphQueryArray.map((item, index) => ({ ...item, index }));
    } else {
      const index = subgraphQueryArray.findIndex((item) => item.name === name);
      if (index === -1) {
        throw new Error(`No Subgraph found with name: ${name}`);
      }
      queriesToExecute = [{ ...subgraphQueryArray[index], index }];
    }

    // 遍历选中的 Subgraph 查询
    const results = await Promise.all(
      queriesToExecute.map(async ({ query, name, description, index }) => {
        console.log(`Fetching data for Subgraph: ${name} (${description}, Index: ${index + 1})`);
        const config = configs[index];
        const data = await request(config.url, query, {}, config.headers);
        return { name, description, data };
      })
    );

    // 详细打印所有结果
    results.forEach(({ name, description, data }, index) => {
      console.log(
        `Data from ${name} (${description}, Subgraph ${queriesToExecute[index].index + 1}):`,
        util.inspect(data, { showHidden: false, depth: null, colors: true })
      );
    });

    return results;
  } catch (error) {
    console.error('Error fetching Subgraph data:', error);
    throw error;
  }
}

export { fetchSubgraphData };