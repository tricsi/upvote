module.exports = (sequelize, DataTypes) => {

    const RESULT_LENGTH = 5;

    const Vote = sequelize.define('Vote', {
        login: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        result: {
            type: DataTypes.JSON,
        }
    });

    Vote.findActive = async function(login) {
        return Vote.findOne({
            where: {
                login: login,
                result: null
            }
        });
    };

    Vote.createActive = async function(login) {
        return await sequelize.transaction(async t => {
            const entries = await sequelize.models.Entry.findAllQueued(login, {transaction: t});
            let i = 0;
            while (i < entries.length && entries[i].hasVoteByLogin(login)) {
                i++;
            }
            let j = i + 1;
            while (j < entries.length && (
                entries[j].hasVoteByLogin(login) ||
                entries[j].hasVoteInCommon(entries[i])
            )) {
                j++;
            }
            if (j >= entries.length) {
                return null;
            }
            const vote = await Vote.create({login: login}, {transaction: t});
            await entries[i].increment({round: 1}, {transaction: t});
            await entries[j].increment({round: 1}, {transaction: t});
            await vote.addEntry(entries[i], {transaction: t});
            await vote.addEntry(entries[j], {transaction: t});
            return vote;
        });
    };

    Vote.prototype.saveResult = async function(result) {
        if (!result instanceof  Array || result.length !== RESULT_LENGTH) {
            throw new Error('error_invalid_result_type');
        }
        const increment = [
            {
                score: result.filter(value => value === 0).length
            },
            {
                score: result.filter(value => value === 1).length
            }
        ];
        if (increment[0].score + increment[1].score !== RESULT_LENGTH) {
            throw new Error('error_invalid_result_value');
        }
        if (increment[0].score > increment[1].score) {
            increment[0].win = 1;
            increment[1].loose = 1;
        }
        if (increment[0].score < increment[1].score) {
            increment[1].win = 1;
            increment[0].loose = 1;
        }
        return await sequelize.transaction(async t => {
            const entries = await this.getEntries();
            this.result = result;
            await this.save({transaction: t});
            await entries[0].increment(increment[0], {transaction: t});
            await entries[1].increment(increment[1], {transaction: t});
            return this;
        });
    };

    return Vote;
};