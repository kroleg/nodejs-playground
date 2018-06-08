'use strict';

const Setting = require('../models/setting')

module.exports = {

    async update (req, res, next) {
        try {
            const newProps = req.body;
            delete req.body.user;
            await Setting.findOneAndUpdate({ user: req.user._id }, newProps).select('caloriesPerDay').lean();
            res.send({})
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