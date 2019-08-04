/* eslint-disable no-console */
const Sequelize = require('sequelize');
const sequelize = new Sequelize(
  process.env.DATABASE_URL || process.argv[2],
  { logging: process.env.DATABASE_LOG || process.argv[3] ? console.log : false }
);

const Comment = sequelize.import('./comment');
const Entry = sequelize.import('./entry');
const Vote = sequelize.import('./vote');

Comment.belongsTo(Entry);
Entry.hasMany(Comment);
Entry.Vote = Entry.belongsToMany(Vote, { through: 'EntryVote' });
Vote.Entry = Vote.belongsToMany(Entry, { through: 'EntryVote' });

module.exports = {
  sequelize: sequelize,
  Comment: Comment,
  Entry: Entry,
  Vote: Vote
};