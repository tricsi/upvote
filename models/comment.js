const sequelize = require('./sequelize');
const Sequelize = require('sequelize');

class Comment extends Sequelize.Model { }

Comment.init({
  login: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  message: {
    type: Sequelize.TEXT,
    validate: {
      len: [0, 3000]
    }
  }
}, {
  sequelize,
  modelName: "Comment"
});

module.exports = Comment;