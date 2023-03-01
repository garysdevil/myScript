// lotus state read-state f04

import fs from 'fs';
import ini from 'ini';
import { HttpJsonRpcConnector, LotusClient } from 'filecoin.js';
import networkPowerDao  from '../dao/index.js';

const config = ini.parse(fs.readFileSync('../config/.local.config.ini', 'utf-8'));
const url = config.filecoin_rpc_url;

const httpConnector = new HttpJsonRpcConnector({ url });
const connector = new LotusClient(httpConnector);

const addNetworkPowerService = async () => {
    // f04 is the accountant actor for power stuff.
    const networkPower = await connector.state.readState('f04');
    const blockHeight = networkPower.State.FirstCronEpoch;
    const minerCount = networkPower.State.MinerCount;
    const totalRawBytePower = networkPower.State.TotalRawBytePower;
    const totalQualityAdjPower = networkPower.State.TotalQualityAdjPower;

    const totalRawBytePowerN = BigInt(totalRawBytePower)
    const totalQualityAdjPowerN = BigInt(totalQualityAdjPower)
    const validDataPowerN = totalQualityAdjPowerN - totalRawBytePowerN

    const obj = {
        miner_count: minerCount, block_height: blockHeight, raw_power: totalRawBytePowerN, valid_power: validDataPowerN, total_power: totalQualityAdjPowerN
    };
    const num = await networkPowerDao.add(obj);
    return num;
}

export {
    addNetworkPowerService
};
