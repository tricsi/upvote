const auth = require('../middleware/auth');
const model = require('../models');
const config = require('../src/config');
const express = require('express');

const router = express.Router();
const VOTE_EXPIRE = parseInt(process.env.VOTE_EXPIRE) || 0;
const VOTE_AVAILABLE = parseInt(process.env.VOTE_AVAILABLE) || 0;

function getTime(date, time) {
  return time ? time * 1000 + date.getTime() : false;
}

function getData(vote) {
  return {
    entries: vote.Entries.map(entry => entry.data),
    createdAt: vote.createdAt.getTime(),
    availableAt: getTime(vote.createdAt, VOTE_AVAILABLE),
    expireAt: getTime(vote.createdAt, VOTE_EXPIRE)
  };
}

router.get('/', auth(false), async (req, res) => {
  const vote = await model.Vote.findActive(req.user.login);
  if (!vote) {
    throw new Error("error_no_active_vote");
  }
  res.send({ data: getData(vote) });
});

router.post('/', auth(false), async (req, res) => {
  const login = req.user.login;
  let vote = await model.Vote.findActive(login);
  if (VOTE_EXPIRE && !vote && await model.Vote.pickExpired(login, VOTE_EXPIRE)) {
    vote = await model.Vote.findActive(login);
  }
  if (!vote && await model.Vote.createActive(login)) {
    vote = await model.Vote.findActive(login);
  }
  if (!vote) {
    throw new Error("error_no_vote_left");
  }
  res.send({ data: getData(vote) });
});

router.patch('/', auth(false), async (req, res) => {
  const login = req.user.login;
  const vote = await model.Vote.findActive(login);
  if (!vote) {
    throw new Error("error_no_active_vote");
  }
  if (VOTE_AVAILABLE && getTime(vote.createdAt, VOTE_AVAILABLE) > new Date().getTime()) {
    throw new Error("error_vote_not_available");
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