module.exports = (sequelize, DataTypes) => {

  const Comment = sequelize.define('Comment', {
    login: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    message: {
      type: DataTypes.TEXT,
      validate: {
        len: [0, 3000]
      }
    }
  });

  return Comment;
};