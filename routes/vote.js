const auth = require('../middleware/auth');
const model = require('../models');
const express = require('express');
const router = express.Router();
const Op = require('sequelize').Op;

router.post('/', auth, async (req, res) => {
    const login = req.user.login;
    let vote = await model.Vote.findOne({
        where: {
            login: login,
            result: null
        }
    });
    if (!vote) {
        const entries = await model.Entry.findAll({
            where: {
                github_repository: { $notLike: `${login}/%`}
            },
            order: [
                ['round'],
                ['loose'],
                ['score'],
                ['seed']
            ]
        });
        try {
            await model.sequelize.transaction(async t => {
                vote = await model.Vote.create({
                    login: login,
                }, {transaction: t});
                await vote.addEntry(entries[0], {transaction: t});
                await vote.addEntry(entries[1], {transaction: t});
            });
        } catch (error) {
            console.log(error);
        }
    }
    res.send(await vote.getEntries());
});

module.exports = router;