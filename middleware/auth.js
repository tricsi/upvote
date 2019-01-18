const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    let token = req.header('Authorization') || '';
    token = token.replace('Bearer', '').trim();
    if (!token) {
        return res.status('401').send({error: 'missing_token'});
    }
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.user = payload;
        next();
    } catch (ex) {
        res.status('401').send({error: 'invalid_token'});
    }
}