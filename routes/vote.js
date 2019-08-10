const auth = require('../middleware/auth');
const model = require('../models');
const config = require('../src/config');
const express = require('express');
const router = express.Router();
const expire = parseInt(process.env.VOTE_EXPIRE) || 0;

router.get('/', auth(false), async (req, res) => {
  const vote = await model.Vote.findActive(req.user.login);
  if (!vote) {
    throw new Error("error_no_active_vote");
  }
  res.send({ data: vote.getData() });
});

router.post('/', auth(false), async (req, res) => {
  const login = req.user.login;
  let vote = await model.Vote.findActive(login);
  if (expire && !vote && await model.Vote.pickExpired(login, expire)) {
    vote = await model.Vote.findActive(login);
  }
  if (!vote && await model.Vote.createActive(login)) {
    vote = await model.Vote.findActive(login);
  }
  if (!vote) {
    throw new Error("error_no_vote_left");
  }
  res.send({ data: vote.getData() });
});

router.patch('/', auth(false), async (req, res) => {
  const login = req.user.login;
  const vote = await model.Vote.findActive(login);
  if (!vote) {
    throw new Error("error_no_active_vote");
  }
  await vote.saveResult(req.body.result, config.criteria.length);
  if (req.body.comments instanceof Array) {
    const entries = await vote.getEntries();
    entries.forEach(async (entry, i) => {
      const message = typeof req.body.comments[i] === 'string'
        ? req.body.comments[i].trim()
        : '';
      if (message !== '') {
        await entry.saveComment(login, message);
      }
    });
  }
  res.send({ data: vote.id });
});

module.exports = router;