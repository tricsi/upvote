/* eslint-disable no-console */
const express = require('express');
const cors = require('cors');
require('express-async-errors');
const model = require('./models');
const error = require('./middleware/error');
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
    await model.sequelize.authenticate();
    app.listen(port, () => {
        console.log(`Server listening on port ${port}!`);
    });
}

start();