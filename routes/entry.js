const config = require('../src/config');
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
      category: entry.data.category,
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
      criteria: config.criteria.map(criteria => ({
        name: criteria,
        score: 0
      })),
      comments: entry.Comments.map(comment => ({
        login: comment.login,
        message: comment.message,
        createdAt: comment.createdAt.getTime()
      }))
    };
    for (const vote of entry.Votes) {
      for (let i = 0; i < vote.result.length; i++) {
        const id = vote.result[i];
        if (!id) {
          data.criteria[i].score += 1;
        } else if (id === entry.id) {
          data.criteria[i].score += 2;
        }
      }
    }
  }
  res.send({ data: data });
});

module.exports = router;