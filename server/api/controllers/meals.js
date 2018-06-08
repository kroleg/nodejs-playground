'use strict';

const Meal = require('../models/meal');
const User = require('../models/user');

module.exports = {

    async list (req, res, next) {
        try {
            const user = await getUser(req);
            const dbSearchQuery = { user: user._id };
            if (req.query.dateFrom) {
                dbSearchQuery.date = { $gte: req.query.dateFrom, $lte: req.query.dateTo };
            }
            if (req.query.timeFrom) {
                dbSearchQuery.time = { $gte: req.query.timeFrom, $lte: req.query.timeTo };
            }
            const meals = await Meal.find(dbSearchQuery)
            res.send(meals)
        } catch (err) {
            next(err)
        }
    },

    async create(req, res, next) {
        try {
            const user = await getUser(req);
            await Meal.create({ ...req.body, user: user._id });
            res.send({})
        } catch (err) {
            next(err)
        }
    },

    async read(req, res, next) {
        try {
            const meal = await Meal.findOne({ _id: req.params.mealId }).lean();
            res.send(meal)
        } catch (err) {
            next(err)
        }
    },


    async update (req, res, next) {
        try {
            const newProps = req.body;
            // delete req.body._id;
            await Meal.findOneAndUpdate({ _id: req.params.mealId }, newProps);
            res.send({})
        } catch (err) {
            next(err)
        }
    },

    async delete (req, res, next) {
        try {
            await Meal.remove({ _id: req.params.mealId });
            res.send({})
        } catch (err) {
            next(err)
        }
    },
}


async function getUser(req) {
    if (req.params.userId === 'me') {
        if (!req.user) {
            throw new Error('no user authenticated')
        }
        return req.user ;
    } else {
        const user = await User.findOne({ _id: req.params.userId });
        if (!user) {
            throw new Error('user not found')
        }
        return user;
    }
}