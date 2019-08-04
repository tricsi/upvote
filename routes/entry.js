const model = require('../models');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    const data = await model.Entry.findAll({
        include: {
            model: model.Vote
        }
    }).map(entry => {
        return {
            ...entry.data,
            id: entry.id,
            login: entry.login,
            round: entry.round,
            win: entry.win,
            lose: entry.lose,
            score: entry.score,
            votes: entry.Votes.map(vote => vote.id)
        }
    });
    res.send(data);
});

module.exports = router;