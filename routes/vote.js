const auth = require('../middleware/auth');
const model = require('../models');
const express = require('express');
const router = express.Router();

router.get('/', auth, async (req, res) => {
    const vote = await model.Vote.findActive(req.user.login);
    if (!vote) {
        return res.send({error: "error_no_active_vote"});
    }
    res.send({data: await vote.getEntries()});
});

router.post('/', auth, async (req, res) => {
    const login = req.user.login;
    let vote = await model.Vote.findActive(login);
    if (!vote) {
        const entries = await model.Entry.findNext(login);
        vote = await model.Vote.createActive(login, entries);
    }
    if (!vote) {
        return res.send({error: "error_no_vote_left"});
    }
    res.send({data: await vote.getEntries()});
});

router.patch('/', auth, async (req, res) => {
    const vote = await model.Vote.findActive(req.user.login);
    if (!vote) {
        return res.send({error: "error_no_active_vote"});
    }
    try {
        await vote.saveResult(req.body.result);
    } catch(e) {
        return res.send({error: e.message});
    }
    res.send(vote);
});

module.exports = router;