'use strict';

const User = require('../models/user');
const { encryptPassword } = require('./helpers/password');

module.exports = {

    async list (req, res, next) {

    },

    async create(req, res, next) {
        try {
            // todo validate email and enforce non-empty password
            const userData = { email: req.body.email, encryptedPassword: await encryptPassword(req.body.password) }
            const user = (await User.create(userData)).toObject();
            req.login(user, function (err) {
                if (err) {
                    return next(err);
                }
                res.send('ok');
            });

        } catch (err) {
            next(err)
        }
    },

    read: () => {},

    update: () => {},

    delete: () => {},

}
