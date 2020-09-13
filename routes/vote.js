const auth = require('../middleware/auth');
const model = require('../models');
const config = require('../config');
const express = require('express');

const router = express.Router();
const VOTE_AVAILABLE = config.env.VOTE_AVAILABLE;
const VOTE_CATEGORY = config.env.VOTE_CATEGORY;
const VOTE_EXPIRE = config.env.VOTE_EXPIRE;
const VOTE_ROUNDS = config.env.VOTE_ROUNDS;

function getTime(date, time) {
  return time ? time * 1000 + date.getTime() : false;
}

function getData(vote) {
  return {
    id: vote.id,
    login: vote.login,
    result: vote.result,
    entries: [
      { ...vote.entryOne.data, id: vote.entryOneId },
      { ...vote.entryTwo.data, id: vote.entryTwoId }
    ],
    createdAt: vote.createdAt.getTime(),
    availableAt: getTime(vote.createdAt, VOTE_AVAILABLE),
    expireAt: getTime(vote.createdAt, VOTE_EXPIRE)
  };
}

router.get('/', auth(false), async ({ user }, res) => {
  const vote = await model.Vote.findActive(user.login);
  if (!vote) {
    throw new Error("error_no_active_vote");
  }
  const data = getData(vote);
  res.send({ data });
});

router.post('/', auth(false), async ({ user }, res) => {
  let vote = await model.Vote.findActive(user.login);
  if (VOTE_EXPIRE && !vote && await model.Vote.pickExpired(user.login, VOTE_EXPIRE)) {
    vote = await model.Vote.findActive(user.login);
  }
  if (!vote && await model.Vote.createActive(VOTE_ROUNDS, VOTE_CATEGORY, user.login)) {
    vote = await model.Vote.findActive(user.login);
  }
  if (!vote) {
    throw new Error("error_no_vote_left");
  }
  const data = getData(vote);
  res.send({ data });
});

router.patch('/', auth(false), async ({ user, body }, res) => {
  const vote = await model.Vote.findActive(user.login);
  if (!vote) {
    throw new Error("error_no_active_vote");
  }
  if (VOTE_AVAILABLE && getTime(vote.createdAt, VOTE_AVAILABLE) > new Date().getTime()) {
    throw new Error("error_vote_not_available");
  }
  await vote.saveResult(body.result, config.criteria.length);
  if (body.comments instanceof Array) {
    const comments = body.comments.map(comment => typeof comment === 'string' ? comment.trim() : '');
    vote.entryOne.saveComment(user.login, comments[0] || '');
    vote.entryTwo.saveComment(user.login, comments[1] || '');
  }
  res.send({ data: vote.id });
});

module.exports = router;