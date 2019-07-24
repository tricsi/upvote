module.exports = (sequelize, DataTypes) => {

    const Entry = sequelize.define('Entry', {
        login: {
            type: DataTypes.STRING,
            allowNull: false
        },
        data: {
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
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            defaultValue: 0
        },
        seed: {
            type: DataTypes.FLOAT,
            allowNull: false,
            defaultValue: () => Math.random()
        }
    });

    Entry.findAllQueued = async function(config) {
        return Entry.findAll({
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