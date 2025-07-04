// graphql.js

import { gql } from 'graphql-request';

const dxTerminal = {
  name: 'dxTerminal',
  description: 'Subgraph for DX Terminal NFT',
  url: 'https://gateway.thegraph.com/api/subgraphs/id/AHWmwW5phXnc2q5UCcKytju5J2kT9hPV9o4AskyaWMhT',
  query: gql`
    {
        transfers(
          orderBy:blockTimestamp,orderDirection:asc, where: {blockTimestamp_gte: 1751385600,blockTimestamp_lte: 1751472000},first:1000
          ) {
          from
          blockTimestamp
          tokenId
        },
        globalTransferCounts(
        ) {
          id,
          count,
          lastUpdated
        },
    },
    
  `,
};

// 定义 Subgraph 查询数组
const subgraphQueryArray = [dxTerminal];

// 导出 Subgraph 查询数组
export { subgraphQueryArray };