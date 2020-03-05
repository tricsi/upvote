const sequelize = require('./sequelize');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

class Entry extends Sequelize.Model {

  static async findAllQueued(maxRound, config) {
    const where = {};
    if (maxRound) {
      where.round = { [Op.lt]: maxRound };
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
  }

  async getVotes() {
    if (!this.Votes) {
      this.Votes = sequelize.models.Vote.findAll({
        where: {
          result: { [Op.ne]: null },
          [Op.or]: [{ entryOneId: this.id }, { entryTwoId: this.id }]
        }
      });
    }
    return this.Votes;
  }

  async hasVoteByLogin(login) {
    const votes = await this.getVotes();
    return votes.some(vote => vote.login === login);
  }

  async hasVoteInCommon(entry) {
    const votes = await this.getVotes();
    for (let i = 0; i < votes.length; i++) {
      if (votes.some(vote => vote.id === votes[i].id)) {
        return true;
      }
    }
    return false;
  }

  async saveComment(login, message) {
    await sequelize.transaction(async t => {
      const comment = await sequelize.models.Comment.create({
        login: login,
        message: message,
      }, { transaction: t });
      await comment.setEntry(this, { transaction: t });
      return comment;
    });
  }

}

Entry.init({
  login: {
    type: Sequelize.STRING,
    allowNull: false
  },
  data: {
    type: Sequelize.JSON,
    allowNull: false
  },
  round: {
    type: Sequelize.INTEGER.UNSIGNED,
    allowNull: false,
    defaultValue: 0
  },
  win: {
    type: Sequelize.INTEGER.UNSIGNED,
    allowNull: false,
    defaultValue: 0
  },
  lose: {
    type: Sequelize.INTEGER.UNSIGNED,
    allowNull: false,
    defaultValue: 0
  },
  score: {
    type: Sequelize.INTEGER.UNSIGNED,
    allowNull: false,
    defaultValue: 0
  },
  result: {
    type: Sequelize.JSON,
  },
  tbs: {
    type: Sequelize.INTEGER.UNSIGNED,
    allowNull: false,
    defaultValue: 0
  },
  seed: {
    type: Sequelize.FLOAT,
    allowNull: false,
    defaultValue: () => Math.random()
  }
}, {
  sequelize,
  modelName: "Entry"
});

module.exports = Entry;