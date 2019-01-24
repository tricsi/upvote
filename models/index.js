const Sequelize = require('sequelize');
const sequelize = new Sequelize(process.env.DATABASE_URL, {
    logging: process.env.DATABASE_LOG ? console.log : false,
    operatorsAliases: false
});

const Entry = sequelize.import('./entry');
const Vote = sequelize.import('./vote');

Entry.belongsToMany(Vote, {through: 'EntryVote'});
Vote.belongsToMany(Entry, {through: 'EntryVote'});

module.exports = {
    sequelize: sequelize,
    Entry: Entry,
    Vote: Vote
};