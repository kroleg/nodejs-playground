'use strict';

const Meal = require('../models/meal');
const authRules = require('../auth-rules')

module.exports = {

    async meals ({ userId, dateFrom, dateTo, timeFrom, timeTo }, { user: currentUser }) {
        const mealsOwnerId = getMealOwnerId(userId, currentUser)
        if (mealsOwnerId !== currentUser._id && authRules.notAllowedToCRUDMeals(currentUser)) {
            throw new Error('Not allowed to create meal on behalf of other user')
        }
        const dbSearchQuery = { user: mealsOwnerId };
        if (dateFrom) {
            dbSearchQuery.date = { $gte: dateFrom, $lte: dateTo };
        }
        if (timeFrom) {
            dbSearchQuery.time = { $gte: timeFrom, $lte: timeTo };
        }
        return Meal.find(dbSearchQuery)
    },

    async createMeal({ userId, data: mealBody }, { user: currentUser } ) {
        const mealOwnerId = getMealOwnerId(userId, currentUser)
        if (mealOwnerId !== currentUser._id && authRules.notAllowedToCRUDMeals(currentUser)) {
            throw new Error('Not allowed to create meal on behalf of other user')
        }
        const calories = Number(typeof mealBody.calories === 'string' ? mealBody.calories.trim() : mealBody.calories)
        if (isNaN(calories) || calories <= 0) {
            throw new Error('Calories shold be positive number')
        }
        return Meal.create({ ...mealBody, user: mealOwnerId });
    },

    async updateMeal({ userId, mealId, data: mealBody }, { user: currentUser } ) {
        const mealOwnerId = getMealOwnerId(userId, currentUser)
        const meal = await readMealByUser(mealId, mealOwnerId, currentUser)
        return Meal.findOneAndUpdate({ _id: meal._id }, mealBody, { new: true });
    },

    async meal({ mealId }, request) {
        const mealOwnerId = getMealOwnerId(request.user)
        return readMealByUser(mealId, mealOwnerId, request.user)
    },

    async deleteMeal ({ mealId, userId }, { user: currentUser }) {
        const mealOwnerId = getMealOwnerId(userId, currentUser)
        const meal = await readMealByUser(mealId, mealOwnerId, currentUser)
        await Meal.remove({ _id: meal._id });
        return {}
    },
}

function getMealOwnerId (paramUserId, currentUser) {
    let mealOwnerId = paramUserId
    if (mealOwnerId === 'me') {
        mealOwnerId = currentUser._id
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
