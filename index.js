const express = require('express');
const bodyParser = require('body-parser');
const model = require('./models');
const fs = require('fs');
const app = express();
const port = process.env.PORT;

app.set('model', model);
app.use(bodyParser.urlencoded());
app.use('/auth', require('./routes/auth'));
app.use('/api/ping', require('./routes/ping'));
app.use('/api/entry', require('./routes/entry'));
app.use('/api/vote', require('./routes/vote'));

async function start() {
    const data = JSON.parse(fs.readFileSync('./data/import.json', 'utf8'));
    await model.sequelize.authenticate();
    await model.sequelize.sync({force: true});
    await model.Entry.bulkCreate(data);
    app.listen(port, () => {
        console.log(`Server listening on port ${port}!`);
    });
}

start();