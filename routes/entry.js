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
      id: entry.id,
      login: entry.login,
      title: entry.data.title,
      win: entry.win,
      lose: entry.lose,
      score: entry.score,
      votes: entry.Votes.filter(vote => vote.result).map(vote => vote.id)
    }
  });
  res.send(data);
});

router.get('/:id', async (req, res) => {
  let data = null;
  const entry = await model.Entry.findOne({
    where: { id: req.params.id },
    include: [{
      model: model.Comment
    }, {
      model: model.Vote,
      include: { model: model.Entry }
    }]
  });
  if (entry) {
    data = {
      ...entry.data,
      id: entry.id,
      login: entry.login,
      score: entry.score,
      comments: entry.Comments.map(comment => ({
        login: comment.login,
        message: comment.message,
        createdAt: comment.createdAt.getTime()
      })),
      votes: entry.Votes.map(vote => ({
        entry: vote.Entries.filter(item => item.id != entry.id).map(item => ({
          id: item.id,
          login: item.login,
          title: item.data.title,
          score: item.score
        })).pop(),
        result: vote.result,
        createdAt: vote.createdAt.getTime(),
        updatedAt: vote.updatedAt.getTime()
      }))
    };
  }
  res.send({ data: data });
});

module.exports = router;