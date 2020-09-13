const auth = require('../middleware/auth');
const model = require('../models');
const config = require('../config');
const express = require('express');
const router = express.Router();
const VOTE_CATEGORY = config.env.VOTE_CATEGORY;

router.get('/', auth(false), async (req, res) => {
  const login = req.user.login;
  const myVotes = await model.Vote.findFinished(login);
  let votableEntries = await model.Entry.findAllEnabled(VOTE_CATEGORY);
  votableEntries = votableEntries.filter(e => e.login !== login);

  res.send({
    data: {
      votedEntries: myVotes.length * 2,
      totalEntries: votableEntries.length
    }
  });
});

module.exports = router;