import knex from 'knex';
import { database } from './.local.config.js';


// module.exports = {knex({
//     client: 'mysql',
//     connection: database,
//     pool: { min: 3, max: 50 },
// })};

const Knex = knex({
    client: 'mysql',
    connection: database,
    pool: { min: 3, max: 50 },
});

export {
    Knex
}