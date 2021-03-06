'use strict';

const api = require('express')();
module.exports = api;

const
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
    .get(usersController.list)
    .post(usersController.create);
api.route("/users/:userId")
    .get(usersController.read)
    .delete(usersController.delete)
    .patch(usersController.update);

api.use(function(req, res, next) {
    res.status(404).send()
})

api.use(function(err, req, res, next) {
    if (err.message.match(/requires auth/)) {
        return res.status(403).send({ error: err.message })
    }
    next(err)
})
