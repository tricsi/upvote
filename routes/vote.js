const auth = require('../middleware/auth');
const model = require('../models');
const config = require('../src/config');
const express = require('express');

const router = express.Router();
const VOTE_ROUNDS = parseInt(process.env.VOTE_ROUNDS) || 0;
const VOTE_EXPIRE = parseInt(process.env.VOTE_EXPIRE) || 0;
const VOTE_AVAILABLE = parseInt(process.env.VOTE_AVAILABLE) || 0;
const AUTH_ADMIN = process.env.AUTH_ADMIN ? process.env.AUTH_ADMIN.split(',') : [];

function getTime(date, time) {
  return time ? time * 1000 + date.getTime() : false;
}

function getData(vote) {
  return {
    id: vote.id,
    login: vote.login,
    result: vote.result,
    entries: [
      {...vote.entryOne.data, id: vote.entryOneId},
      {...vote.entryTwo.data, id: vote.entryTwoId}
    ],
    createdAt: vote.createdAt.getTime(),
    availableAt: getTime(vote.createdAt, VOTE_AVAILABLE),
    expireAt: getTime(vote.createdAt, VOTE_EXPIRE)
  };
}

async function getDataWithComments(vote) {
  const data = getData(vote);
  const comments = await vote.findComments();
  data.comments = comments.map(comment => ({
    id: comment.EntryId,
    message: comment.message,
  }));
  return data;
}

router.get('/all', auth(false), async ({user}, res) => {
  const votes = await model.Vote.findAll({
    where: { login: user.login },
    include: { all: true },
    order: [["updatedAt", "DESC"]]
  });
  res.send({ data: votes.map(vote => getData(vote)) });
});

router.get('/', auth(false), async ({user}, res) => {
  const vote = await model.Vote.findActive(user.login);
  if (!vote) {
    throw new Error("error_no_active_vote");
  }
  const data = await getDataWithComments(vote);
  res.send({ data });
});

router.get('/:id', auth(), async ({user, params}, res) => {
  const where = { id: params.id };
  if (!AUTH_ADMIN.includes(user.login)) {
    where.login = user.login;
  }
  const vote = await model.Vote.findOne({where, include: {all: true}});
  if (!vote) {
    return res.status('404').send({ error: 'error_vote_not_found' });
  }
  const data = await getDataWithComments(vote);
  res.send({ data });
});

router.post('/', auth(false), async ({user}, res) => {
  let vote = await model.Vote.findActive(user.login);
  if (!vote && await model.Vote.createActive(VOTE_ROUNDS, user.login)) {
    vote = await model.Vote.findActive(user.login);
  }
  if (!vote) {
    throw new Error("error_no_vote_left");
  }
  res.send({ data: await getDataWithComments(vote) });
});

router.patch('/', auth(false), async ({user, body}, res) => {
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