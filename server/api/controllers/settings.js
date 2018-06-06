'use strict';

const Setting = require('../models/setting')

module.exports = {

    async list (req, res, next) {
        try {
            const user = await getUser(req);
            let settings = await Setting.findOne({ user: user._id })
            if (!settings) {
                settings = { caloriesPerDay: 0 }
            }
            res.send(settings)
        } catch (err) {
            next(err)
        }
    },

    async update (req, res, next) {
        try {
            const newProps = req.body;
            delete req.body.user;
            await Setting.findOneAndUpdate({ user: req.user._id }, newProps).select('caloriesPerDay').lean();
            res.status(200).end()
        } catch (err) {
            next(err)
        }
    },
}


async function getUser(req) {
    if (!req.user) {
        throw new Error('no user authenticated')
    }
    return req.user;
}