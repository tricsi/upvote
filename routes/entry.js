const auth = require('../middleware/auth');
const axios = require('axios');
const express = require('express');
const router = express.Router();

router.post('/', auth, async (req, res) => {
    try {
        const name = req.body.name;
        const owner = req.user.login;
        const model = req.app.get('model');
        if (!name || !name.match(/^[0-9a-z]+$/i)) {
            throw new Error('error_invalid_repo');
        }
        let entry = await model.Entry.findOne({ where: {
             name: name,
             owner: owner
        }});
        if (!entry) {
            let resp;
            try {
                resp = await axios.get(`https://api.github.com/repos/${owner}/${name}`);
            } catch(error) {
                throw new Error('error_invalid_repo');
            }
            entry = model.Entry.create({
                name: name,
                owner: owner,
                url: resp.data.html_url
            });
        }
        res.send({
            success: true
        });
    } catch(error) {
        res.status(400).send({
            success: false,
            error: error.message
        })
    }
});

module.exports = router;