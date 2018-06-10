'use strict';

const User = require('../models/user');
const Meal = require('../models/meal');
const Setting = require('../models/setting');
const { encryptPassword } = require('./helpers/password');
const authRules = require('../auth-rules')

module.exports = {

    async list (req, res, next) {
        try {
            if (authRules.notAllowedToCRUDUsers(req.user)) {
                return res.status(403).send({ error: 'Not allowed to list users'})
            }
            //todo pagination
            const users = await User.find().select('-encryptedPassword').lean()
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

            const user = await User.create(userData)
            res.status(201).send({ userId: user._id })

        } catch (err) {
            next(err)
        }
    },

    async read (req, res, next) {
        try {
            let userId = req.params.userId
            if (req.params.userId === 'me') {
                userId = req.user._id;
            }
            if (userId !== req.user._id && authRules.notAllowedToCRUDUsers(req.user)) {
                return res.status(403).send({ error: 'Not allowed to read other users'})
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
            let userId = req.params.userId
            if (req.params.userId === 'me') {
                userId = req.user._id;
            }
            if (userId !== req.user._id && authRules.notAllowedToCRUDUsers(req.user)) {
                return res.status(403).send({ error: 'Not allowed to read other users'})
            }

            const userData = { ...req.body }
            delete userData._id;
            delete userData.role;

            //check that email wasn't taken
            const existingUser = await User.findOne({ email: userData.email }).lean()
            if (existingUser) {
                return res.status(422).send({ error: 'User with such email already exists' })
            }

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
            if (req.params.userId === 'me') {
                userId = req.user._id;
            }
            if (userId === req.user._id) {
                return res.status(422).send({ error: `You can not delete yourself!` })
            }
            if (authRules.notAllowedToCRUDUsers(req.user)) {
                return res.status(403).send({ error: 'Not allowed to delete other users'})
            }

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
