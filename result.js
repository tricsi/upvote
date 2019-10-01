const model = require('./models');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const START = 3;
const END = 28;
const TIE = 6;

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
        entry.Votes.sort((a, b) => {
            const scoreA = a.result.filter(id => id === entry.id).length;
            const scoreB = b.result.filter(id => id === entry.id).length;
            return scoreB - scoreA;
        });
        const votes = entry.Votes.slice(START, END);
        entry.round = votes.length;
        entry.score = 0;
        entry.lose = 0;
        entry.win = 0;
        for (const vote of votes) {
            const score = vote.result.reduce((score, id) => {
                if (id === entry.id) return score + 2;
                if (id === 0) return score + 1;
                return score;
            }, 0);
            entry.score += score;
            entry.lose += score < TIE ? 1 : 0;
            entry.win += score > TIE ? 1 : 0;
        }
        store[entry.id] = votes.map(vote => vote.id);
    }
    for (const entry of entries) {
        entry.tbs = 0;
        entries.forEach(opponent => {
            if (
                entry.id !== opponent.id &&
                store[entry.id].filter(id => store[opponent.id].includes(id)).length
            ) {
                entry.tbs += opponent.score;
            }
        });
        await entry.save();
    }
    entries.sort((a, b) => b.score - a.score || b.tbs - a.tbs);
    entries.map(entry => console.log(entry.data.title, entry.score, entry.tbs));
}

start();