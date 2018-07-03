'use strict';

const api = require('express')();
module.exports = api;

const { buildSchema } = require('graphql')
const expressQraphql = require('express-graphql');

// GraphQL schema
const schema = buildSchema(`
    type Query {
        hello: String,
        meals(userId: ID, dateFrom: Float, dateTo: Float, timeFrom: Int, timeTo: Int): [Meal]
        meal(userId: ID, mealId: ID): Meal
    }
    
    input MealInput {
        date: Float!,
        time: Int!,
        note: String,
        calories: Int!,
    }
    
    type Mutation {
        createMeal(userId: ID, data: MealInput): Meal
        updateMeal(userId: ID, mealId: ID, data: MealInput): Meal
        deleteMeal(userId: ID, mealId: ID): Meal
    }
    
    type Meal {
        _id: ID
        date: Float!,
        time: Int!,
        note: String,
        calories: Int!,
        user: String
    }
`);

// The root provides a resolver function for each API endpoint
const root = {
    ...require('./controllers/meals')
};

api.use('/', expressQraphql({
    schema: schema,
    rootValue: root,
    graphiql: true
}));
