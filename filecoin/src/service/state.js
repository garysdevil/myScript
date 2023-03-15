// lotus state read-state f04

import fs from 'fs';
import ini from 'ini';
import { HttpJsonRpcConnector, LotusClient } from 'filecoin.js';
import { networkPowerDao }  from '../dao/index.js';

const config = ini.parse(fs.readFileSync('../config/.local.config.ini', 'utf-8'));
const url = config.filecoin_rpc_url;

const httpConnector = new HttpJsonRpcConnector({ url });
const connector = new LotusClient(httpConnector);

const addNetworkPowerService = async () => {
    // f04 is the accountant actor for power stuff.
    const networkPower = await connector.state.readState('f04');
    const blockHeight = networkPower.State.FirstCronEpoch;
    const minerCount = networkPower.State.MinerCount;
    const collateral = networkPower.State.TotalPledgeCollateral;
    const rawPower = networkPower.State.TotalRawBytePower;
    const adjPower = networkPower.State.TotalQualityAdjPower;

    const rawPowerN = BigInt(rawPower);
    const adjPowerN = BigInt(adjPower);
    const dc = (adjPowerN - rawPowerN)/9n;
    const cc = rawPowerN - dc;

    const obj = {
        block_height: blockHeight, miner_count: minerCount, collateral: collateral, raw_power: rawPower, adj_power: adjPower, dc, cc
    };
    
    console.log(obj);
    const num = await networkPowerDao.add(obj);
    return num;
}

export {
    addNetworkPowerService
};
