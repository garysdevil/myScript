// graphql.js

import { gql } from 'graphql-request';

const dxTerminal = {
  name: 'dxTerminal',
  description: 'Subgraph for DX Terminal',
  url: 'https://gateway.thegraph.com/api/subgraphs/id/AHWmwW5phXnc2q5UCcKytju5J2kT9hPV9o4AskyaWMhT',
  query: gql`
    {
        approvalForAlls(first: 5) {
            id
            owner
            operator
            approved
        }
        transfers(where: { from: "0xfeda2DCb016567DEb02C3b59724cf09Dbc41A64D" }) {
            id
            from
            to
            tokenId
        }
    }
  `,
};

// 定义 Subgraph 查询数组
const subgraphQueryArray = [dxTerminal];

// 导出 Subgraph 查询数组
export { subgraphQueryArray };