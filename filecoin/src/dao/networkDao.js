import {Knex} from './knex.js';

const add = async obj => {
    await Knex('network').insert(obj);
    return 1;
};

const get = async columns => {
    let all;
    if (columns) {
        all = await Knex.select(columns).table('network');
    } else {
        all = await Knex.select('*').table('network');
    }
    return all;
};

export {
    add,
    get,
};

