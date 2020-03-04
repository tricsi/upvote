const Sequelize = require('sequelize');
const Op = Sequelize.Op;

module.exports = (sequelize, DataTypes) => {

  const Vote = sequelize.define('Vote', {
    login: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    result: {
      type: DataTypes.JSON,
    }
  });

  Vote.findActive = async function (login) {
    const vote = await Vote.findOne({
      where: {
        login: login,
        result: null
      },
      include: {
        all: true
      }
    });
    return vote;
  };

  Vote.createActive = async function (maxRound, login, mine, same, again) {
    return await sequelize.transaction(async t => {
      const entries = await sequelize.models.Entry.findAllQueued(maxRound, { transaction: t });
      let i = 0;
      while (i < entries.length && (
        (!mine && entries[i].login === login)
        || (!same && await entries[i].hasVoteByLogin(login))
      )) {
        i++;
      }
      let j = i + 1;
      while (j < entries.length && (
        (!mine && entries[j].login === login)
        || (!same && await entries[j].hasVoteByLogin(login))
        || (!again && await entries[j].hasVoteInCommon(entries[i]))
      )) {
        j++;
      }
      if (j >= entries.length) {
        return null;
      }
      const vote = await Vote.create({
        login: login,
        entryOneId: entries[i].id,
        entryTwoId: entries[j].id
      }, { transaction: t });
      await entries[i].increment({ round: 1 }, { transaction: t });
      await entries[j].increment({ round: 1 }, { transaction: t });
      return vote;
    });
  };

  Vote.findAllByLogin = async function (login) {
    const votes = await Vote.findAll({
      where: {
        login: login,
        result: {[Op.not]: null}
      }
    });
    return votes;
  };

  Vote.prototype.findComments = async function () {
    const ids = [this.entryOne.id, this.entryTwo.id];
    const result = await sequelize.models.Comment.findAll({
      where: {
        login: this.login,
        EntryId: ids,
      }
    });
    return result;
  }

  Vote.prototype.saveResult = async function (result, length) {
    if (
      !(result instanceof Array) ||
      result.length !== length ||
      result.filter(i => i === -1 || i === 0 || i === 1).length !== length
    ) {
      throw new Error('error_invalid_result_type');
    }
    const increment = [
      { score: result.reduce((score, val) => score - val + 1, 0) },
      { score: result.reduce((score, val) => score + val + 1, 0) }
    ];
    if (increment[0].score !== increment[1].score) {
      if (increment[0].score > increment[1].score) {
        increment[0].win = 1;
        increment[1].lose = 1;
      }
      if (increment[0].score < increment[1].score) {
        increment[1].win = 1;
        increment[0].lose = 1;
      }
    }
    return await sequelize.transaction(async t => {
      this.result = result.map(i => i ? (i < 0 ? this.entryOneId : this.entryTwoId) : 0);
      await this.save({ transaction: t });
      await this.entryOne.increment(increment[0], { transaction: t });
      await this.entryTwo.increment(increment[1], { transaction: t });
      return this;
    });
  };

  return Vote;
};