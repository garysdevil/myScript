import fs from 'fs';
import ini from 'ini';
import { HttpJsonRpcConnector, MnemonicWalletProvider, LotusClient } from 'filecoin.js';
import {varIDTop1000Arr, varTipSetArr} from './var.js';


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
const getAllActorBalance = async () => {

    const tipSetKey = [{'/': "bafy2bzacecnamqgqmifpluoeldx7zzglxcljo6oja4vrmtj7432rphldpdmm2"}] // 区块0
    // const tipSetKey = [{'/': "bafy2bzaceajzynaaeg7o7hkzyei547a44uf3etmrpnwwc64e7644mvh6pbedi"}] // 2554678

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

const getSomeActorBalance = async () => {
    let totalBalance = 0;
    for (let i = 0; i < varIDTop1000Arr.length; i++){
        const id = varIDTop1000Arr[i];
        const tipSetKey = [{'/': "bafy2bzacedhy76xl22ontdtv7bo2ytu3ae646bb4ktqwg5xe77toimnid73ty"}]
        // const tipSetKey = varTipSetArr[0];
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


(async () => {
    // await balanceStatitic();
    // await getInitBalance();

    await getSomeActorBalance();

})().then().catch();



// API
// ChainGetTipSetByHeight https://lotus.filecoin.io/reference/lotus/chain/#chaingettipsetbyheight


// js
// const date_format = date.getFullYear() + "-" + (date.getMonth() < 10 ? '0' + (date.getMonth()+1) : (date.getMonth()+1)) + "-" + (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + (date.getHours() < 10 ? '0' + date.getHours() : date.getHours());
// 

// Record
// 28天出的块高 80640
// 29天出的块高 83520
// 30天出的块高 86400
// 31天出的块高 89280
// 2557680  2023-01-30 08:00:00 bafy2bzacebbyaialqmyzbhsqer34h5qxez2kv5ucej3ara5rvlitmzhlyvqce
// 2474160  2023-01-01 08:00:00 bafy2bzacebc4cbnmtml5spegjzoqkcyjphjdvhqz354qh5gpkvl45mihms2fs
// 2384880  2022-12-01 08:00:00 bafy2bzacec4wvnyfb77wyd6cwlqtathwaslrt7fky22yrvsyisink4kokmkhm
// 2298480  2022-11-01 08:00:00 bafy2bzaceb6iadeod46q35tz2gekv6lc5do63bqdutc3ngt3pigcuxcl6bthi
// 2209200  2022-10-01 08:00:00 bafy2bzacedj7o65vfnverobzt352hils3lf5f6faxk7x7di54by72vsla47wu
// 2122800  2022-09-01 08:00:00 bafy2bzaceanpybku5z2lzehievuwwazmzmnqwtwocfqvosexnnxejsrvmilhe
// 2033520  2022-08-01 08:00:00 bafy2bzacebfb5stp46fbebiggkgvptutf3mzjl2y6vneprb5abejc43vnqrlg
// 1944240  2022-07-01 08:00:00 bafy2bzacecycpyvhsc6qmmsxrebmknenkkxwj3uwezlsmtncna7vgnzlgy7mm
// 1857840  2022-06-01 08:00:00 bafy2bzacecs7btc7l2x2335k74b7kh3pmleym3gnppp6x5psltoxcnmp53af6
// 1768560  2022-05-01 08:00:00 bafy2bzacedcl4dsfa4yuyvf3rjbwezitm464tfwzb5aw4i46kqmx4r36sysxw
// 1682160  2022-04-01 08:00:00 bafy2bzacedjf4aqxxsnrp6tqsc6tssphft7agukvrx574bsjcigddyjcl26vy
// 1592880  2022-03-01 08:00:00 bafy2bzacecw6pnmueggfj3qs27ypz2yh3lyo3z2n3n7wkzk5fjbwrwxbwxx7o
// 1509360  2022-02-01 08:00:00 bafy2bzacedhy76xl22ontdtv7bo2ytu3ae646bb4ktqwg5xe77toimnid73ty
// 1422960  2022-01-01 08:00:00 bafy2bzaced4ovprspwl4q3kttmodtd7lxth26fmsmzybhkpdjbvrm5xn5x4wg