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

    Vote.createActive = async function(login, entries) {
        return await sequelize.transaction(async t => {
            const vote = await Vote.create({login: login}, {transaction: t});
            await entries[0].increment({round: 1}, {transaction: t});
            await entries[1].increment({round: 1}, {transaction: t});
            await vote.addEntry(entries[0], {transaction: t});
            await vote.addEntry(entries[1], {transaction: t});
            return vote;
        });
    };

    Vote.findActive = async function(login) {
        return Vote.findOne({
            where: {
                login: login,
                result: null
            }
        });
    };

    return Vote;
};