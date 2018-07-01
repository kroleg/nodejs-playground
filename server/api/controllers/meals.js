'use strict';

const Meal = require('../models/meal');
const authRules = require('../auth-rules')

module.exports = {

    async list (req, res, next) {
        try {
            const mealsOwnerId = getMealOwnerId(req)
            if (mealsOwnerId !== req.user._id && authRules.notAllowedToCRUDMeals(req.user)) {
                return res.status(403).send({ error: 'Not allowed to create meal on behalf of other user'})
            }
            const dbSearchQuery = { user: mealsOwnerId };
            if (req.query.dateFrom) {
                dbSearchQuery.date = { $gte: req.query.dateFrom, $lte: req.query.dateTo };
            }
            if (req.query.timeFrom) {
                dbSearchQuery.time = { $gte: req.query.timeFrom, $lte: req.query.timeTo };
            }
            const meals = await Meal.find(dbSearchQuery).lean()
            res.send(meals)
        } catch (err) {
            next(err)
        }
    },

    async create(req, res, next) {
        try {
            const mealOwnerId = getMealOwnerId(req)
            if (mealOwnerId !== req.user._id && authRules.notAllowedToCRUDMeals(req.user)) {
                return res.status(403).send({ error: 'Not allowed to create meal on behalf of other user'})
            }
            const calories = Number(typeof req.body.calories === 'string' ? req.body.calories.trim() : req.body.calories)
            if (isNaN(calories) || calories <= 0) {
                return res.status(400).send({ error: 'Calories shold be positive number'})
            }
            const meal = await Meal.create({ ...req.body, user: mealOwnerId });
            res.status(201).send({ mealId: meal._id })
        } catch (err) {
            next(err)
        }
    },

    async read(req, res, next) {
        try {
            const mealOwnerId = getMealOwnerId(req)
            const meal = await readMealByUser(req.params.mealId, mealOwnerId, req.user)
            res.send(meal)
        } catch (err) {
            if (err.message.match(/not found/i)) {
                return res.status(404).send({ error: 'Meal not found'})
            }
            if (err.message.match(/not allowed/i)) {
                return res.status(403).send({ error: 'Not allowed to read meal on behalf of other user'})
            }
            next(err)
        }
    },


    async update (req, res, next) {
        try {
            const mealOwnerId = getMealOwnerId(req)
            const meal = await readMealByUser(req.params.mealId, mealOwnerId, req.user)
            const newProps = { ...req.body };
            delete newProps._id;
            await Meal.findOneAndUpdate({ _id: meal._id }, newProps);
            res.send({})
        } catch (err) {
            if (err.message.match(/not found/i)) {
                return res.status(404).send({ error: 'Meal not found'})
            }
            if (err.message.match(/not allowed/i)) {
                return res.status(403).send({ error: 'Not allowed to update meal on behalf of other user'})
            }
            next(err)
        }
    },

    async delete (req, res, next) {
        try {
            const mealOwnerId = getMealOwnerId(req)
            const meal = await readMealByUser(req.params.mealId, mealOwnerId, req.user)
            await Meal.remove({ _id: meal._id });
            res.send({})
        } catch (err) {
            if (err.message.match(/not found/i)) {
                return res.status(404).send({ error: 'Meal not found'})
            }
            if (err.message.match(/not allowed/i)) {
                return res.status(403).send({ error: 'Not allowed to delete meal on behalf of other user'})
            }
            next(err)
        }
    },
}

function getMealOwnerId (req) {
    let mealOwnerId = req.params.userId
    if (mealOwnerId === 'me') {
        mealOwnerId = req.user._id
    }
    return mealOwnerId
}

/**
 *
 * @param mealId
 * @param mealOwnerId
 * @param user
 * @returns {Promise<void>}
 */
async function readMealByUser (mealId, mealOwnerId, user) {
    const meal = await Meal.findOne({ _id: mealId, user: mealOwnerId }).lean();
    if (!meal) {
        throw new Error('not found')
    }
    if (meal.user !== user._id && authRules.notAllowedToCRUDMeals(user)) {
        throw new Error('not allowed')
    }
    return meal
}
