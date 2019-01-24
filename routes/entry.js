const model = require('../models');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const data = await model.Entry.findAll({
            order: [['score', 'desc']]
        });
        res.send(data);
    } catch(error) {
        res.status(400).send({
            success: false,
            error: error.message
        })
    }
});

module.exports = router;