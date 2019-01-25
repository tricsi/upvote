module.exports = function (err, req, res, next) {
    if (err.message) {
        let code = 500;
        let data = {
            error: 'error_system_error'
        };
        if (err.message.match(/^error_/)) {
            code = 400;
            data.error = err.message;
        } else {
            next(err);
        }
        res.status(code).send(data);
    }
};