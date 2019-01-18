const express = require('express');
const auth = require('./middleware/auth');
const app = express();
const port = process.env.PORT || 3000;

app.use('/auth', require('./routes/auth'));
app.use('/api/ping', auth, require('./routes/ping'));

app.listen(port, () => {
    console.log(`Server listening on port ${port}!`);
});