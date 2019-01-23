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
    res.send({data: await vote.getEntries()});
});

module.exports = router;