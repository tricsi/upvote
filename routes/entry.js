const auth = require('../middleware/auth');
const config = require('../src/config');
const model = require('../models');
const express = require('express');
const router = express.Router();

router.get('/', auth(true), async (req, res) => {
  const data = await model.Entry.findAll().map(entry => {
    return {
      id: entry.id,
      login: entry.login,
      title: entry.data.title,
      category: entry.data.category,
      round: entry.round,
      result: entry.result,
      score: entry.score,
      tbs: entry.tbs
    }
  });
  res.send(data);
});

router.get('/:id', auth(true), async (req, res) => {
  const entry = await model.Entry.findOne({
    where: { id: req.params.id },
    include: { model: model.Comment }
  });
  if (!entry) {
    return res.status('404').send({ error: 'error_entry_not_found' });
  }
  const data = {
    ...entry.data,
    id: entry.id,
    login: entry.login,
    round: entry.round,
    result: entry.result,
    score: entry.score,
    criteria: config.criteria.map((criteria, i) => ({
      name: criteria,
      score: entry.result[i]
    })),
    comments: entry.Comments.map(comment => ({
      login: comment.login,
      message: comment.message,
      createdAt: comment.createdAt.getTime()
    }))
  };
  res.send({ data: data });
});

module.exports = router;