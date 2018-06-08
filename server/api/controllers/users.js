'use strict';

const User = require('../models/user');
const Meal = require('../models/meal');
const Setting = require('../models/setting');
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
            // normalize
            req.body.email = req.body.email.trim()

            // check validity
            if (!req.body.password) {
                return res.status(400).send({ error: 'Password is required' })
            }
            if (!req.body.email.match(/.*@.*\..*/)) {
                return res.status(400).send({ error: 'Email should be in format user@example.com' })
            }

            const userData = { email: req.body.email, encryptedPassword: await encryptPassword(req.body.password) }

            //check that email wasn't taken
            const existingUser = await User.findOne({ email: userData.email }).lean()
            if (existingUser) {
                return res.status(422).send({ error: 'User with such email already exists' })
            }

            // allow to set role only if user is create by admin or manager
            if (req.user && ['admin', 'manager'].includes(req.user.role)) {
                userData.role = req.body.role
            }

            await User.create(userData)
            res.send({})

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
            const user = await User.findOne({ _id: userId }).select('-encryptedPassword').lean()
            user.settings = await Setting.findOne({ user: userId }).select('-_id -user').lean()
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
            const userId = req.params.userId
            const userData = { ...req.body }
            delete userData._id;
            delete userData.role;
            // allow to set role only if user is create by admin or manager
            if (['admin', 'manager'].includes(req.user.role)) {
                userData.role = req.body.role
            }
            const user = await User.findOneAndUpdate({ _id: userId }, userData, { new: true }).select('email').lean()
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
            await Meal.remove({ user: userId })
            res.send(user)
        } catch (err) {
            next(err)
        }
    },

}
