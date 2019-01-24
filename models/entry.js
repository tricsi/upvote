const Sequelize = require('sequelize');
const Op = Sequelize.Op;

module.exports = (sequelize, DataTypes) => {

    const Entry = sequelize.define('Entry', {
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        categories: {
            type: DataTypes.JSON,
            allowNull: false
        },
        github_repository: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        authors: {
            type: DataTypes.JSON,
            allowNull: false
        },
        images: {
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
        loose: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            defaultValue: 0
        },
        score: {
            type: DataTypes.FLOAT,
            allowNull: false,
            defaultValue: 0
        },
        seed: {
            type: DataTypes.FLOAT,
            allowNull: false,
            defaultValue: () => Math.random()
        }
    }, {
        indexes: [
            {
                fields: ['github_repository'],
                unique: true
            }
        ]
    });

    Entry.findAllQueued = async function(login, config) {
        return Entry.findAll({
            where: {
                github_repository: {
                    [Op.notLike]: `${login}/%`
                }
            },
            include: {
                model: sequelize.models.Vote
            },
            order: [
                ['round'],
                ['loose'],
                ['score'],
                ['seed']
            ]
        }, config);
    };

    Entry.prototype.hasVoteByLogin = function(login) {
        return this.Votes.some(vote => vote.login === login);
    };

    Entry.prototype.hasVoteInCommon = function(entry) {
        for (let i = 0; i < this.Votes.length; i++) {
            if (entry.Votes.some(vote => vote.id === this.Votes[i].id)) {
                return true;
            }
        }
        return false;
    };

    return Entry;
};