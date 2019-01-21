const Sequelize = require('sequelize');
const sequelize = new Sequelize(process.env.DATABASE_URL);

const Entry = sequelize.import('./entry');
const Vote = sequelize.import('./vote');

Entry.belongsToMany(Vote, {through: 'EntryVote'});
Vote.belongsToMany(Entry, {through: 'EntryVote'});

module.exports = {
    sequelize: sequelize,
    Entry: Entry,
    Vote: Vote
};