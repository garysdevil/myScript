import fs from 'fs';
import ini from 'ini';
import { HttpJsonRpcConnector, MnemonicWalletProvider, LotusClient } from 'filecoin.js';

const config = ini.parse(fs.readFileSync('.local.config.ini', 'utf-8'));
const url = config.filecoin_rpc_url;

const httpConnector = new HttpJsonRpcConnector({ url });
const connector = new LotusClient(httpConnector);

const attoFILToFIL = 10**18;

// 获取创世区块里的钱包地址余额
const getGenerateBlockWalletBalance = async () => {

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

// 获取代币的流通情况, 默认为创世区块的 Tipset
const getVmCirculatingSupply = async (tipSet="bafy2bzacecnamqgqmifpluoeldx7zzglxcljo6oja4vrmtj7432rphldpdmm2") => {
    const tipSetKey = [{'/': tipSet}];
    // 供应量
    const supplyStatistic = await connector.state.vmCirculatingSupply(tipSetKey);
    
    const filVested = supplyStatistic.FilVested.substring(0, supplyStatistic.FilVested.length - 18) * 1;
    const filMined = supplyStatistic.FilMined.substring(0, supplyStatistic.FilMined.length - 18) * 1;
    const filBurnt = supplyStatistic.FilBurnt.substring(0, supplyStatistic.FilBurnt.length - 18) * 1;
    const filLocked = supplyStatistic.FilLocked.substring(0, supplyStatistic.FilLocked.length - 18) * 1;
    const filCirculating = supplyStatistic.FilCirculating.substring(0, supplyStatistic.FilCirculating.length - 18) * 1;
    const filReserveDisbursed = supplyStatistic.FilReserveDisbursed.substring(0, supplyStatistic.FilReserveDisbursed.length - 18) * 1;

    console.log({filVested, filMined, filBurnt, filLocked, filCirculating, filReserveDisbursed});
    console.log("Liquid Token", filVested + filMined - filBurnt - filLocked + filReserveDisbursed);

}

// 获取所有钱包地址的余额
// 默认为创世区块上的所有钱包地址的余额
const getAllActorBalance = async (tipSet="bafy2bzacecnamqgqmifpluoeldx7zzglxcljo6oja4vrmtj7432rphldpdmm2") => {

    const tipSetKey = [{'/': tipSet}]

    // 输出所有的actor
    const actors = await connector.state.listActors();
    console.log(actors);

    let totalBalance = 0;
    // 串联，查询
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
    // 100个并发为一组，查询
    while (actors.length > 0){
        let i = 100
        if ( actors.length < 100 ){
            i = 0;
        }
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

// 获取指定tipset，指定钱包地址的余额
const getActorArrBalance = async (walletIDArr, tipset = "bafy2bzacecnamqgqmifpluoeldx7zzglxcljo6oja4vrmtj7432rphldpdmm2") => {
    let totalBalance = 0;
    for (let i = 0; i < walletIDArr.length; i++){
        const id = walletIDArr[i];

        const tipSetKey = [{'/': tipset}]
        const actor = await connector.state.getActor(id, tipSetKey).catch((e) => {
            // console.log(e);
        });

        if (actor == null){
            continue;
        }

        const balanceStr = actor.Balance;
        const balance = balanceStr.substring(0, balanceStr.length - 18) * 1;
        console.log(balance);
        totalBalance += balance;
    }
    console.log(totalBalance);
    
}

// 通过块高输出tipSet和时间
const getTipsetAndTimeByHeight = async (tipset = "bafy2bzacecnamqgqmifpluoeldx7zzglxcljo6oja4vrmtj7432rphldpdmm2") => {
    const res = await connector.chain.getTipSetByHeight(2400000);
    let cid = res.Cids[0]['/']; // 获取块高的第一个tipSet
    let timestamp = res.Blocks[0].Timestamp;
    let date = new Date(timestamp * 1000);
    console.log(cid);
    console.log(date);
}

export {getGenerateBlockWalletBalance, getVmCirculatingSupply, getAllActorBalance, getActorArrBalance, getTipsetAndTimeByHeight};


// API
// ChainGetTipSetByHeight https://lotus.filecoin.io/reference/lotus/chain/#chaingettipsetbyheight