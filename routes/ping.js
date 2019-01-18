const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send({
        ack: new Date().getTime()
    });
});

module.exports = router;