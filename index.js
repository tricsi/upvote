const express = require('express');
const cors = require('cors');
require('express-async-errors');
const model = require('./models');
const sequelize = require('./models/sequelize');
const error = require('./middleware/error');
const app = express();
const port = process.env.PORT || 80;

app.set('model', model);
app.use(cors());
app.use(express.json());
app.use(express.static('dist'));
app.use('/auth', require('./routes/auth'));
app.use('/api/ping', require('./routes/ping'));
app.use('/api/entry', require('./routes/entry'));
app.use('/api/vote', require('./routes/vote'));
app.use('/api/stats', require('./routes/stats'));
app.get('/*', (req, res) => {
  res.sendFile(__dirname + '/dist/index.html');
});
app.use(error);

async function start() {
  await sequelize.authenticate();
  app.listen(port, () => {
        // eslint-disable-next-line no-console
        console.log(`Server listening on port ${port}!`);
  });
}

start();