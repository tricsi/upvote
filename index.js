/* eslint-disable no-console */
const express = require('express');
const cors = require('cors');
require('express-async-errors');
const model = require('./models');
const error = require('./middleware/error');
const fs = require('fs');
const app = express();
const port = process.env.PORT;

app.set('model', model);
app.use(cors());
app.use(express.json());
app.use(express.static('dist'));
app.use('/auth', require('./routes/auth'));
app.use('/api/ping', require('./routes/ping'));
app.use('/api/entry', require('./routes/entry'));
app.use('/api/vote', require('./routes/vote'));
app.use(error);

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