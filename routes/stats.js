const auth = require('../middleware/auth');
const model = require('../models');
const express = require('express');
const router = express.Router();

router.get('/', auth(false), async (req, res) => {
  const login = req.user.login;
  const myVotes = await model.Vote.findFinished(login);
  const votableEntries = await model.Entry.findAll().filter(e => e.login !== login);

  res.send({
    data: {
      votedEntries: myVotes.length * 2,
      totalEntries: votableEntries.length
    }
  });
});

module.exports = router;