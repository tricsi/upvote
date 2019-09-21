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
        model: sequelize.models.Entry
      }
    });
    return vote;
  };

  Vote.pickExpired = async function (login, expire, mine, same) {
    return await sequelize.transaction(async t => {
      const votes = await Vote.findAll({
        where: {
          result: null,
          updatedAt: { [Op.lt]: new Date(new Date() - expire * 1000) }
        },
        include: {
          model: sequelize.models.Entry,
          include: {
            model: sequelize.models.Vote
          }
        }
      }, { transaction: t });
      for (const vote of votes) {
        let valid = true;
        for (const entry of vote.Entries) {
          if (
            (!mine && entry.login === login) ||
            (!same && entry.hasVoteByLogin(login))
          ) {
            valid = false;
          }
        }
        if (valid) {
          vote.login = login;
          await vote.save();
          return vote;
        }
      }
      return null;
    });
  }

  Vote.createActive = async function (maxRound, login, mine, same, again) {
    return await sequelize.transaction(async t => {
      const entries = await sequelize.models.Entry.findAllQueued(maxRound, { transaction: t });
      let i = 0;
      while (i < entries.length && (
        (!mine && entries[i].login === login) ||
        (!same && entries[i].hasVoteByLogin(login))
      )) {
        i++;
      }
      let j = i + 1;
      while (j < entries.length && (
        (!mine && entries[j].login === login) ||
        (!same && entries[j].hasVoteByLogin(login)) ||
        (!again && entries[j].hasVoteInCommon(entries[i]))
      )) {
        j++;
      }
      if (j >= entries.length) {
        return null;
      }
      const vote = await Vote.create({ login: login }, { transaction: t });
      await vote.addEntry(entries[i], { transaction: t });
      await vote.addEntry(entries[j], { transaction: t });
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
    const ids = this.Entries.map(entry => entry.id);
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
      const entries = await this.getEntries();
      this.result = result.map(i => i ? entries[i < 0 ? 0 : 1].id : 0);
      await this.save({ transaction: t });
      await entries[0].increment(increment[0], { transaction: t });
      await entries[1].increment(increment[1], { transaction: t });
      return this;
    });
  };

  return Vote;
};