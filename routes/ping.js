const express = require('express');
const route = express.Router();

route.get('/', (req, res) => {
    res.send({
        id: req.user.id,
        ack: new Date().getTime()
    });
});

module.exports = route;