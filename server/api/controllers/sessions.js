'use strict';

const { validatePassword } = require('./helpers/password');
const User = require('../models/user')

module.exports = {
    async create (req, res, next) {
        try {
            const user = await User.findOne({ email: req.body.email });
            if (!user) {
                return res.status(401).send({ error: 'No user with such email'})
            }
            const passwordValid = await validatePassword(req.body.password, user.encryptedPassword);
            if (!passwordValid) {
                return res.status(401).send({ error: 'Invalid password'})
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
        res.send({});
    }
}
