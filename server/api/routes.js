'use strict';

const api = require('express')();
module.exports = api;

const mealsController = require('./controllers/meals'),
    usersController = require('./controllers/users'),
    sessionsController = require('./controllers/sessions');

api.use(function (req, res, next) {
    if ((req.path.match(/sessions/) || req.path === '/users') && req.method === 'POST') {
        return next()
    }
    if (req.isAuthenticated()) {
        return next()
    }
    next(new Error(`request ${req.method} ${req.path} requires authentication but none provided`))
})

api.route('/sessions')
    .delete(sessionsController.delete)
    .post(sessionsController.create);

api.route('/users')
    // .get(usersController.list)
    .post(usersController.create);
api.route("/users/:id")
    // .get(usersController.read)
    // .delete(usersController.delete)
    // .put(usersController.update);


api.route('/users/:userId/meals')
    .get(mealsController.list)
    .post(mealsController.create);
api.route('/users/:userId/meals/:mealId')
    .get(mealsController.read)
    .delete(mealsController.delete)
    .put(mealsController.update);
