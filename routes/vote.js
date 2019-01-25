const auth = require('../middleware/auth');
const model = require('../models');
const express = require('express');
const router = express.Router();

router.get('/', auth, async (req, res) => {
    const vote = await model.Vote.findActive(req.user.login);
    if (!vote) {
        throw new Error("error_no_active_vote");
    }
    res.send({data: vote.getData()});
});

router.post('/', auth, async (req, res) => {
    const login = req.user.login;
    let vote = await model.Vote.findActive(login);
    if (!vote) {
        await model.Vote.createActive(login);
        vote = await model.Vote.findActive(login);
    }
    if (!vote) {
        throw new Error("error_no_vote_left");
    }
    res.send({data: vote.getData()});
});

router.patch('/', auth, async (req, res) => {
    const vote = await model.Vote.findActive(req.user.login);
    if (!vote) {
        throw new Error("error_no_active_vote");
    }
    await vote.saveResult(req.body.result, 5);
    res.send({data: vote.id});
});

module.exports = router;