const Comment = require('./comment');
const Entry = require('./entry');
const Vote = require('./vote');

Comment.belongsTo(Entry);
Entry.hasMany(Comment);
Vote.belongsTo(Entry, {as: "entryOne"});
Vote.belongsTo(Entry, {as: "entryTwo"});

module.exports = {
  Comment,
  Entry,
  Vote
};