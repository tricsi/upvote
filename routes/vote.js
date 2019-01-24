const auth = require('../middleware/auth');
const model = require('../models');
const express = require('express');
const router = express.Router();

router.get('/', auth, async (req, res) => {
    const vote = await model.Vote.findActive(req.user.login);
    if (!vote) {
        throw new Error("error_no_active_vote");
    }
    res.send({data: await vote.getEntries()});
});

router.post('/', auth, async (req, res) => {
    const login = req.user.login;
    let vote = await model.Vote.findActive(login);
    if (!vote) {
        vote = await model.Vote.createActive(login);
    }
    if (!vote) {
        throw new Error("error_no_vote_left");
    }
    res.send({data: await vote.getEntries()});
});

router.patch('/', auth, async (req, res) => {
    const vote = await model.Vote.findActive(req.user.login);
    if (!vote) {
        throw new Error("error_no_active_vote");
    }
    await vote.saveResult(req.body.result);
    res.send(vote);
});

module.exports = router;