// lotus state read-state f04


import fs from 'fs';
import ini from 'ini';
import { HttpJsonRpcConnector, LotusClient } from 'filecoin.js';
import networkDao  from '../dao/index.js';

const config = ini.parse(fs.readFileSync('../config/.local.config.ini', 'utf-8'));
const url = config.filecoin_rpc_url;

const httpConnector = new HttpJsonRpcConnector({ url });
const connector = new LotusClient(httpConnector);


(async () => {
    // f04 is the accountant actor for power stuff.
    // const tipSetKey = [{'/': "bafy2bzacecnamqgqmifpluoeldx7zzglxcljo6oja4vrmtj7432rphldpdmm2"}] // 区块0
    const networkPower = await connector.state.readState('f04');
    const totalRawBytePower = networkPower.State.TotalRawBytePower;
    const totalQualityAdjPower = networkPower.State.TotalQualityAdjPower;
    const blockHeight = networkPower.State.FirstCronEpoch;

    const totalRawBytePowerN = BigInt(totalRawBytePower)
    const totalQualityAdjPowerN = BigInt(totalQualityAdjPower)
    const validDataPowerN = totalQualityAdjPowerN - totalRawBytePowerN
    const validDataN = validDataPowerN/10n;

    console.log({networkPower});
    console.log({validDataPowerN});
    console.log(validDataN);

    const obj = {
        blockHeight, raw_power: totalRawBytePowerN, adj_power: totalQualityAdjPowerN
    };
    await networkDao.add(obj);

})().then().catch();

