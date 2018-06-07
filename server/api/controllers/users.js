'use strict';

const User = require('../models/user');
const { encryptPassword } = require('./helpers/password');

module.exports = {

    async list (req, res, next) {
        try {
            //todo check rights
            //todo pagination
            const users = await User.find().lean()
            res.send(users)
        } catch (err) {
            next(err)
        }
    },

    async create(req, res, next) {
        try {
            if (!req.body.password) {
                return res.status(400).send({ error: 'Password is required' })
            }
            req.body.email = req.body.email.trim()
            if (!req.body.email.match(/.*@.*\..*/)) {
                return res.status(400).send({ error: 'Email should be in format user@example.com' })
            }
            const userData = { email: req.body.email, encryptedPassword: await encryptPassword(req.body.password) }
            const existingUser = await User.findOne({ email: userData.email }).lean()
            if (existingUser) {
                return res.status(422).send({ error: 'User with such email already exists' })
            }
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

    async read (req, res, next) {
        try {
            let userId = req.params.userId
            if (req.params.userId === 'me') {
                userId = req.user._id;
            } else {
                //todo check rights
            }
            const user = await User.findOne({ _id: userId }).select('email').lean()
            // if (req.params.userId === 'me') {
            //     user.settings = await Setting.findOne({ user: user._id }).lean()
            // }
            if (!user) {
                return res.status(404).send({ error: `User ${userId} not found` })
            }
            res.send(user)
        } catch (err) {
            next(err)
        }
    },

    async update (req, res, next) {
        try {
            let userId = req.params.userId
            delete req.body._id;
            const user = await User.findOneAndUpdate({ _id: userId }, req.body, { new: true }).select('email').lean()
            if (!user) {
                return res.status(404).send({ error: `User ${userId} not found` })
            }
            res.send(user)
        } catch (err) {
            next(err)
        }
    },

    async delete (req, res, next) {
        try {
            let userId = req.params.userId
            const user = await User.findOne({ _id: userId }).lean()
            if (!user) {
                return res.status(404).send({ error: `User ${userId} not found` })
            }
            await User.remove({ _id: userId })
            res.send(user)
        } catch (err) {
            next(err)
        }
    },

}
