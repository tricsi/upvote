const Sequelize = require('sequelize');
const sequelize = new Sequelize(process.env.DATABASE_URL);

module.exports = {

    sequelize: sequelize,

    Entry: sequelize.define('Entry', {
        name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        owner: {
            type: Sequelize.STRING,
            allowNull: false
        },
        url: {
            type: Sequelize.STRING,
            allowNull: false
        },
        score: {
            type: Sequelize.FLOAT,
            allowNull: false,
            defaultValue: 0
        },
        valid: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false
        }
    }, {
        indexes: [
            {
                fields: ['name'],
                unique: true
            }
        ]
    })
    
};