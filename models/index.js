const Sequelize = require('sequelize');
const sequelize = new Sequelize(process.env.DATABASE_URL);

module.exports = {

    sequelize: sequelize,

    Entry: sequelize.define('Entry', {
        title: {
            type: Sequelize.STRING,
            allowNull: false
        },
        description: {
            type: Sequelize.TEXT,
            allowNull: false
        },
        categories: {
            type: Sequelize.JSON,
            allowNull: false
        },
        github_repository: {
            type: Sequelize.TEXT,
            allowNull: false
        },
        authors: {
            type: Sequelize.JSON,
            allowNull: false
        },
        images: {
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
        loose: {
            type: Sequelize.INTEGER.UNSIGNED,
            allowNull: false,
            defaultValue: 0
        },
        score: {
            type: Sequelize.FLOAT,
            allowNull: false,
            defaultValue: 0
        }
    }, {
        indexes: [
            {
                fields: ['github_repository'],
                unique: true
            }
        ]
    })
    
};