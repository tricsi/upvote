const sequelize = require('./sequelize');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

function categoryFilter(entry, category)
{
  return category instanceof Array
    ? category.filter(c => entry.data.category.includes(c)).length
    : true;
}

class Entry extends Sequelize.Model {

  static async findAllEnabled(category) {
    const result = await Entry.findAll({
      order: [["score", "DESC"], ["tbs", "DESC"]],
    });
    return result.filter(entry => categoryFilter(entry, category));
  }

  static async findAllQueued(maxRound, category, config) {
    const where = {};
    if (maxRound) {
      where.round = { [Op.lt]: maxRound };
    }
    const result = await Entry.findAll({
      where: where,
      order: [ ['round'], ['lose'], ['score'], ['seed']]
    }, config);
    return result.filter(entry => categoryFilter(entry, category));
  }

  async getVotes(unfinished = true) {
    if (!this.Votes) {
      this.Votes = await sequelize.models.Vote.findAll({
        where: {
          [Op.or]: [{ entryOneId: this.id }, { entryTwoId: this.id }]
        }
      });
    }
    return this.Votes.filter(vote => unfinished || vote.result !== null);
  }

  async hasVoteByLogin(login) {
    const votes = await this.getVotes();
    return votes.some(vote => vote.login === login);
  }

  async hasVoteInCommon(entry) {
    const votes1 = (await this.getVotes()).map(vote => vote.id);
    const votes2 = (await entry.getVotes()).map(vote => vote.id);
    const common = votes1.filter(id => votes2.includes(id));
    return common.length > 0;
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