const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    let token = req.header('Authorization') || '';
    token = token.replace('Bearer', '').trim();
    if (!token) {
        return res.status('401').send({error: 'error_missing_token'});
    }
    try {
        const data = jwt.verify(token, process.env.JWT_SECRET);
        req.user = data;
        next();
    } catch (ex) {
        res.status('401').send({error: 'error_invalid_token'});
    }
}