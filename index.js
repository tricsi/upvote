const express = require('express');
const bodyParser = require('body-parser');
const model = require('./models');
const app = express();
const port = process.env.PORT;

app.set('model', model);
app.use(bodyParser.urlencoded());
app.use('/auth', require('./routes/auth'));
app.use('/api/ping', require('./routes/ping'));
app.use('/api/entry', require('./routes/entry'));

async function start() {
    await model.sequelize.authenticate();
    await model.sequelize.sync();
    app.listen(port, () => {
        console.log(`Server listening on port ${port}!`);
    });
}

start();