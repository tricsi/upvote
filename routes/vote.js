const auth = require('../middleware/auth');
const model = require('../models');
const express = require('express');
const router = express.Router();
const Op = require('sequelize').Op;

router.post('/', auth, async (req, res) => {
    let vote = await model.Vote.findOne({
        where: {
            login: req.user.login,
            result: null
        }
    });
    if (!vote) {
        vote = await model.Vote.create({
            login: req.user.login,
        });
        const entry1 = await model.Entry.findOne({
            where: {
                github_repository: { $notLike: `${req.user.login}/%`}
            }
        });
        await vote.addEntry(entry1);
        const entry2 = await model.Entry.findOne({
            where: {
                id: { $ne: entry1.id },
                github_repository: { $notLike: `${req.user.login}/%`}
            }
        });
        await vote.addEntry(entry2);
    }
    res.send(await vote.getEntries());
});

module.exports = router;