'use strict';

const { validatePassword } = require('./helpers/password');
const User = require('../models/user')

module.exports = {
    async create (req, res, next) {
        try {
            const user = await User.findOne({ email: req.body.email });
            if (!user) {
                throw new Error('No such user')
            }
            if (!validatePassword(req.body.password, user.encryptedPassword)) {
                throw new Error('Invalid password')
            }
            req.login(user, function (err) {
                if (err) {
                    return next(err);
                }
                res.send('ok');
            })
        } catch (err) {
            next(err)
        }
    },

    delete (req, res, next) {
        req.logout();
        res.status(200).end();
    }
}
