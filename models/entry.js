const Sequelize = require('sequelize');
const Op = Sequelize.Op;

module.exports = (sequelize, DataTypes) => {

  const Entry = sequelize.define('Entry', {
    login: {
      type: DataTypes.STRING,
      allowNull: false
    },
    data: {
      type: DataTypes.JSON,
      allowNull: false
    },
    round: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0
    },
    win: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0
    },
    lose: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0
    },
    score: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0
    },
    result: {
      type: DataTypes.JSON,
    },
    tbs: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0
    },
    seed: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: () => Math.random()
    }
  });

  Entry.findAllQueued = async function (maxRound, config) {
    const where = {};
    if (maxRound) {
      where.round = {[Op.lt]: maxRound};
    }
    return Entry.findAll({
      where: where,
      order: [
        ['round'],
        ['lose'],
        ['score'],
        ['seed']
      ]
    }, config);
  };

  Entry.prototype.getVotes = async function() {
    if (!this.Votes) {
      this.Votes = sequelize.models.Vote.findAll({
        where: {
          [Op.or]: [{entryOneId: this.id}, {entryTwoId: this.id}]
        }
      });
    }
    return this.Votes;
  }

  Entry.prototype.hasVoteByLogin = async function (login) {
    const votes = await this.getVotes();
    return votes.some(vote => vote.login === login);
  };

  Entry.prototype.hasVoteInCommon = async function (entry) {
    const votes = await this.getVotes();
    for (let i = 0; i < votes.length; i++) {
      if (votes.some(vote => vote.id === votes[i].id)) {
        return true;
      }
    }
    return false;
  };

  Entry.prototype.saveComment = async function (login, message) {
    await sequelize.transaction(async t => {
      const comment = await sequelize.models.Comment.create({
        login: login,
        message: message,
      }, { transaction: t });
      await comment.setEntry(this, { transaction: t });
      return comment;
    });
  }

  return Entry;
};