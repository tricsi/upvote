const fs = require('fs');
const model = require('../models');
const sequelize = require('../models/sequelize');

async function start() {
  const data = JSON.parse(fs.readFileSync('./data/import.json', 'utf8'));
  await sequelize.authenticate();
  await sequelize.sync({ force: true });
  await model.Entry.bulkCreate(data).catch((err) => {
    // eslint-disable-next-line no-console
    console.log(err.message);
  });
}

start();