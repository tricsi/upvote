/* eslint-disable no-console */
const Sequelize = require('sequelize');
const config = require('../config');

module.exports = new Sequelize(config.env.DATABASE_URL, {
    logging: config.env.DATABASE_LOG ? console.log : false,
    dialectOptions: config.env.DATABASE_URL.match("nossl") ? {} : { ssl: { require: true, rejectUnauthorized: false } }
});
