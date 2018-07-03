'use strict';

const api = require('express')();
module.exports = api;

const { buildSchema } = require('graphql')
const expressQraphql = require('express-graphql');
const Meal = require('./models/meal')
const authRules = require('./auth-rules')

// GraphQL schema
const schema = buildSchema(`
    type Query {
        hello: String,
        meals(userId: ID, dateFrom: Float, dateTo: Float, timeFrom: Int, timeTo: Int): [Meal]
    }
    type Meal {
        _id: ID
        date: Float,
        time: Int,
        note: String,
        calories: Int,
        user: String
    }
`);

// The root provides a resolver function for each API endpoint
const root = {
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
};

api.use('/', expressQraphql({
    schema: schema,
    rootValue: root,
    graphiql: true
}));

function getMealOwnerId (paramUserId, currentUser) {
    let mealOwnerId = paramUserId
    if (mealOwnerId === 'me') {
        mealOwnerId = currentUser._id
    }
    return mealOwnerId
}
