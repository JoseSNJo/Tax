var models = require('../models');
const axios = require('axios');

module.exports = function (req, res, next) {
    var users_id = req.headers.users_id;
    var access_token = req.headers.access_token;
    if (access_token == null || users_id == null) {
        res.status(401).json({
            message: 'Authentication Failed'
        });
    } else {
        var config = {
            headers: {
                'users_id': users_id,
                'access_token': access_token
            }
        };

        var url = 'https://v1.accounts.subdineapis.com/check_access?users_id=' + users_id + '&access_token=' + access_token;
        axios.get(url, config)
            .then(response => {
                res.locals.user = response.data.data.user;
                return next();
            })
            .catch(error => {
                res.status(401).json({
                    message: 'Authentication Failed'
                });
            });
    }
}