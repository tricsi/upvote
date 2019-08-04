const fs = require('fs');
const model = require('./models');

async function start() {
    const data = JSON.parse(fs.readFileSync('./data/import.json', 'utf8'));
    await model.sequelize.authenticate();
    await model.sequelize.sync({ force: true });
    await model.Entry.bulkCreate(data);
}

start();