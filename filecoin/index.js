import fs from 'fs';

import { HttpJsonRpcConnector, MnemonicWalletProvider, LotusClient } from 'filecoin.js';
import ini from 'ini';

const config = ini.parse(fs.readFileSync('.local.config.ini', 'utf-8'));
const url = config.filecoin_rpc_url;

const httpConnector = new HttpJsonRpcConnector({ url });
const connector = new LotusClient(httpConnector);

const attoFILToFIL = 10**18;

const a = async () => {

    
    const tipSetKey = [{'/': "bafy2bzaceaswtld7n6gcv4g7oy7rcklcs7ddus2h3ktwac3bf5ftnpai565mo"}]
    const actor = await connector.state.getActor('f02',tipSetKey);
    
    //   const actors = await connector.state.listActors();
    //   console.log(actor);
    
    const res = await connector.chain.getTipSetByHeight(2400000);
    let cid = res.Cids[0]['/']; // 获取块高的第一个tipSet
    let timestamp = res.Blocks[0].Timestamp;
    let date = new Date(timestamp * 1000);
    
    console.log(cid);
    console.log(date);
    
}

(async () => {

    // 
    // const tipSetKey = [{'/': "bafy2bzaceajzynaaeg7o7hkzyei547a44uf3etmrpnwwc64e7644mvh6pbedi"}] // 2554678

    // 单位换算
    const attoFIL = 18725094090810623060;
    const fil = attoFIL/attoFILToFIL
    

    // const allMiners = await connector.state.listMiners();
    // console.log(allMiners);
    // console.log(allMiners.includes("f01372569"));

    const tipSetKey = [{'/': "bafy2bzacedomx76pldc7nye3tdnmpt3bqt2znhtwhpqz7z3sb3qo5grzf7uem"},
        {"/": "bafy2bzacebp3shtrn43k7g3unredz7fxn4gj533d3o43tqn2p2ipxxhrvchve"}]
    
    // const actor = await connector.miner.getBaseInfo('f01372569', 2556360, tipSetKey); //state.getActor('f01372569');
   


    // Infro无法执行这个功能 获取miner的信息
    // const headTipset = await connector.chain.getHead();
    // const tipsetHeight = headTipset.Blocks[0].Height;
    // console.log(headTipset.Cids[0]);
    // const minerInfo = await connector.miner.getBaseInfo('t01000', tipsetHeight-2, [headTipset.Cids[0]]);
    // console.log(minerInfo);

    // 供应量
    const supplyStatistic = await connector.state.vmCirculatingSupply();
    const filVested = supplyStatistic.FilVested.substring(0, supplyStatistic.FilVested.length - 18) * 1;
    const filMined = supplyStatistic.FilMined.substring(0, supplyStatistic.FilMined.length - 18) * 1;
    const filBurnt = supplyStatistic.FilBurnt.substring(0, supplyStatistic.FilBurnt.length - 18) * 1;
    const filLocked = supplyStatistic.FilLocked.substring(0, supplyStatistic.FilLocked.length - 18) * 1;
    const filCirculating = supplyStatistic.FilCirculating.substring(0, supplyStatistic.FilCirculating.length - 18) * 1;
    const filReserveDisbursed = supplyStatistic.FilReserveDisbursed.substring(0, supplyStatistic.FilReserveDisbursed.length - 18) * 1;
    console.log(filVested + filMined + filBurnt + filLocked + filCirculating + filReserveDisbursed);
    // await a();


})().then().catch();



// API
// ChainGetTipSetByHeight https://lotus.filecoin.io/reference/lotus/chain/#chaingettipsetbyheight


// js
// const date_format = date.getFullYear() + "-" + (date.getMonth() < 10 ? '0' + (date.getMonth()+1) : (date.getMonth()+1)) + "-" + (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + (date.getHours() < 10 ? '0' + date.getHours() : date.getHours());
// 

// Record
// 2300000 bafy2bzacebq6j7k7n6ztzhai3gvkts3haxp3nowgvw735lmvplc7pxx4m5a46
// 2400000 bafy2bzacedo3mozgiebadi3onogbgzrvuix2pbvxcege4uwroo3aypkohm2bm