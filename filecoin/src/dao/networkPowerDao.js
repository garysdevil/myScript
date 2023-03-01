import {Knex} from './knex.js';

const add = async obj => {
    await Knex('network_power_tb').insert(obj);
    return 1;
};

const get = async columns => {
    let all;
    if (columns) {
        all = await Knex.select(columns).table('network_power_tb');
    } else {
        all = await Knex.select('*').table('network_power_tb');
    }
    return all;
};

export {
    add,
    get,
};

