import fs from 'fs';
import ini from 'ini';
import { HttpJsonRpcConnector, MnemonicWalletProvider, LotusClient } from 'filecoin.js';
import {varIDTop1000Arr, varTipSetArr} from './var.js';


const config = ini.parse(fs.readFileSync('.local.config.ini', 'utf-8'));
const url = config.filecoin_rpc_url;

const httpConnector = new HttpJsonRpcConnector({ url });
const connector = new LotusClient(httpConnector);

const attoFILToFIL = 10**18;


const test = async () => {
    // Infro服务无法执行这个功能 获取miner的信息
    // const minerInfo = await connector.miner.getBaseInfo('f0123261', tipsetHeight-2, [headTipset.Cids[0]]);
    // console.log(minerInfo);

    // 单位换算
    const attoFIL = 18725094090810623060;
    const fil = attoFIL/attoFILToFIL

    // const allMiners = await connector.state.listMiners();
    // console.log(allMiners);
    // console.log(allMiners.includes("f01372569"));   
}


// lotus state read-state f04



(async () => {

})().then().catch();

