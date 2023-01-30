import fs from 'fs';
import ini from 'ini';
import { HttpJsonRpcConnector, MnemonicWalletProvider, LotusClient } from 'filecoin.js';


const config = ini.parse(fs.readFileSync('.local.config.ini', 'utf-8'));
const url = config.filecoin_rpc_url;

const httpConnector = new HttpJsonRpcConnector({ url });
const connector = new LotusClient(httpConnector);

const attoFILToFIL = 10**18;


const getInitBalance = async () => {

    // const initialActors = [
    //     'f01002', 'f0105',  'f0110', 'f0113',
    //     'f090',   'f0117',  'f0101', 'f0121',
    //     'f0118',  'f0120',  'f06',   'f0122',
    //     'f04',    'f0106',  'f0112', 'f03',
    //     'f0108',  'f099',   'f0103', 'f0114',
    //     'f0116',  'f01000', 'f0109', 'f00',
    //     'f05',    'f080',   'f01',   'f0100',
    //     'f0115',  'f0119',  'f0104', 'f081',
    //     'f0102',  'f0107',  'f0111', 'f02',
    //     'f01001'
    // ]
    // const initialActors = [
    //     'f01002',  'f0110',  'f0113',  'f090',
    //     'f0117',  'f0101',  'f0121',  'f0118',
    //     'f0120',   'f0122',  'f0112',  'f0114',
    //     'f0116',  'f01000',  'f0100',  'f0115',
    //     'f0119',   'f0102',  'f0111', 'f02',
    //     'f01001'
    // ]
    const initialActors = [
        'f01000', 'f01001', 'f01002', 'f0112',
        'f0113', 'f0114', 'f0100', 'f0101', 
        'f0102', 'f0110', 'f0111', 'f0115',
        'f0116', 'f0117', 'f0118', 'f0119',
        'f0120', 'f0121', 'f0122', 'f090', 
        'f02'
    ]
    let totalBalance = 0;
    for (let i = 0; i < initialActors.length; i++) {
        let id = initialActors[i];
        const tipSetKey = [{'/': "bafy2bzacecnamqgqmifpluoeldx7zzglxcljo6oja4vrmtj7432rphldpdmm2"}] // 区块0
        const actor = await connector.state.getActor(id, tipSetKey);
        const balanceStr = actor.Balance;
        const balance = balanceStr.substring(0, balanceStr.length - 18) * 1;
        totalBalance += balance;
        console.log(id + "  " + balance);
    }
    console.log(totalBalance);
}

const a1 = async () => {
    // Infro服务无法执行这个功能 获取miner的信息
    // const headTipset = await connector.chain.getHead();
    // const tipsetHeight = headTipset.Blocks[0].Height;
    // console.log(headTipset.Cids[0]);
    // const minerInfo = await connector.miner.getBaseInfo('f0123261', tipsetHeight-2, [headTipset.Cids[0]]);
    // console.log(minerInfo);

    // 供应量
    const supplyStatistic = await connector.state.vmCirculatingSupply();
    // console.log(supplyStatistic);
    const filVested = supplyStatistic.FilVested.substring(0, supplyStatistic.FilVested.length - 18) * 1;
    const filMined = supplyStatistic.FilMined.substring(0, supplyStatistic.FilMined.length - 18) * 1;
    const filBurnt = supplyStatistic.FilBurnt.substring(0, supplyStatistic.FilBurnt.length - 18) * 1;
    const filLocked = supplyStatistic.FilLocked.substring(0, supplyStatistic.FilLocked.length - 18) * 1;
    const filCirculating = supplyStatistic.FilCirculating.substring(0, supplyStatistic.FilCirculating.length - 18) * 1;
    const filReserveDisbursed = supplyStatistic.FilReserveDisbursed.substring(0, supplyStatistic.FilReserveDisbursed.length - 18) * 1;
    console.log(filVested + filMined + filBurnt + filLocked + filCirculating + filReserveDisbursed);
    console.log({filVested, filMined, filBurnt, filLocked, filCirculating, filReserveDisbursed});

    // 通过块高输出tipSet和时间
    // const res = await connector.chain.getTipSetByHeight(2400000);
    // let cid = res.Cids[0]['/']; // 获取块高的第一个tipSet
    // let timestamp = res.Blocks[0].Timestamp;
    // let date = new Date(timestamp * 1000);
    // console.log(cid);
    // console.log(date);

    // 单位换算
    const attoFIL = 18725094090810623060;
    const fil = attoFIL/attoFILToFIL

    // const allMiners = await connector.state.listMiners();
    // console.log(allMiners);
    // console.log(allMiners.includes("f01372569"));

    // const actor = await connector.miner.getBaseInfo('f01372569', 2556360, tipSetKey); //state.getActor('f01372569');
   
}
const balanceStatitic = async () => {

    const tipSetKey = [{'/': "bafy2bzacecnamqgqmifpluoeldx7zzglxcljo6oja4vrmtj7432rphldpdmm2"}] // 区块0
    // const tipSetKey = [{'/': "bafy2bzaceajzynaaeg7o7hkzyei547a44uf3etmrpnwwc64e7644mvh6pbedi"}] // 2554678

    // 输出所有的actor
    const actors = await connector.state.listActors();
    console.log(actors);

    let totalBalance = 0;
    // for (let i = 0; i < actors.length; i++) {
    //     let id = actors[i];
    //     const actor = await connector.state.getActor(id);
    //     const balanceStr = actor.Balance;
    //     const balance = balanceStr.substring(0, balanceStr.length - 18) * 1;
    //     if (balance > 10000){
    //         totalBalance += balance;
    //         console.log(id + "  " + balance);
    //     }   
    // }
    for (let i = 100; i <= actors.length; i){
        console.log(actors.length)
        let actorsArr = actors.splice(actors.length - i);
        await Promise.all(await actorsArr.map(async (id) => {
            const actor = await connector.state.getActor(id);
            const balanceStr = actor.Balance;
            const balance = balanceStr.substring(0, balanceStr.length - 18) * 1;
            if (balance > 10000){
                totalBalance += balance;
                console.log(id + "  " + balance);
            } 
        }))
    }

    console.log(totalBalance);


}

(async () => {
    await balanceStatitic();

})().then().catch();



// API
// ChainGetTipSetByHeight https://lotus.filecoin.io/reference/lotus/chain/#chaingettipsetbyheight


// js
// const date_format = date.getFullYear() + "-" + (date.getMonth() < 10 ? '0' + (date.getMonth()+1) : (date.getMonth()+1)) + "-" + (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + (date.getHours() < 10 ? '0' + date.getHours() : date.getHours());
// 

// Record
// 2300000 bafy2bzacebq6j7k7n6ztzhai3gvkts3haxp3nowgvw735lmvplc7pxx4m5a46
// 2400000 bafy2bzacedo3mozgiebadi3onogbgzrvuix2pbvxcege4uwroo3aypkohm2bm