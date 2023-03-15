// 循环定时获取全网算力，写入数据库

import {addNetworkPowerService}  from '../service/state.js';
import {destroyKnex}  from '../dao/knex.js';

function sleep(ms) {
    return new Promise(resolve => setTimeout(() => resolve(), ms));
};


(async () => {
    await addNetworkPowerService();
    console.log(new Date().toLocaleString());
    destroyKnex();

    // let i = 1;
    // while (1) {
    //     await addNetworkPowerService();
    //     console.log(i, new Date().toLocaleString());
    //     i = i+1;
    //     await sleep(600000); // 10 分钟
    // }

})().then().catch();

