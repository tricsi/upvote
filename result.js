const model = require('./models');
const config = require('./src/config');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const START = 3;
const END = 30;
const TIE = config.criteria.length;

async function start() {
    await model.sequelize.authenticate();
    const store = {};
    const entries = await model.Entry.findAll({
        include: {
            model: model.Vote,
            where: {
                result: {[Op.ne]: null}
            }
        }
    });
    for (const entry of entries) {
        let votes = await entry.getVotes();
        votes.sort((a, b) => {
            const scoreA = a.result.reduce((score, id, i) => {
                if (id === entry.id) return score + 2;
                if (id === 0) return score + 1;
                return score;
            }, 0);
            const scoreB = b.result.reduce((score, id, i) => {
                if (id === entry.id) return score + 2;
                if (id === 0) return score + 1;
                return score;
            }, 0);
            return scoreB - scoreA;
        });
        votes = votes.slice(START, END);
        entry.round = votes.length;
        entry.result = new Array(TIE).fill(0);
        entry.score = 0;
        entry.lose = 0;
        entry.win = 0;
        for (const vote of votes) {
            const score = vote.result.reduce((score, id, i) => {
                if (id === entry.id) {
                    entry.result[i] += 2;
                    return score + 2;
                }
                if (id === 0) {
                    entry.result[i] += 1;
                    return score + 1;
                }
                return score;
            }, 0);
            entry.score += score;
            entry.lose += score < TIE ? 1 : 0;
            entry.win += score > TIE ? 1 : 0;
        }
        store[entry.id] = votes.map(vote => vote.id);
    }
    for (const entry of entries) {
        const votes = store[entry.id];
        entry.tbs = 0;
        entries.forEach(async opponent => {
            const opv = await opponent.getVotes();
            if (
                entry.id !== opponent.id &&
                opv.filter(vote => votes.includes(vote.id)).length
            ) {
                entry.tbs += opponent.score;
            }
        });
        await entry.save();
    }
    entries.sort((a, b) => b.score - a.score || b.tbs - a.tbs);
    entries.map((entry, rank) => console.log(rank + 1, entry.data.title, entry.score, entry.tbs, entry.result));
}

start();