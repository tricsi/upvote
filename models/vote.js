module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Vote', {
        login: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        result: {
            type: DataTypes.JSON,
        }
    });
}