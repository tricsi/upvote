const model = require('../models');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    const data = await model.Entry.findAll({
        order: [['score', 'desc']]
    });
    res.send(data);
});

module.exports = router;