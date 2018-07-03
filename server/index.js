'use strict';

const
    express = require('express'),
    config = require('./config'),
    bodyParser = require('body-parser'),
    app = express();

const passport = require('passport');
require('./passport-init');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);

const mongoose = require('mongoose');
mongoose.connect(config.mongoUrl);

app.use(express.static(__dirname + '/../public'));
app.use(bodyParser.json());
// // require('serve-favicon')(__dirname + '/public/img/favicon.png'),

app.use(session({
    store: new RedisStore({
        url: config.redisStore.url
    }),
    secret: config.redisStore.secret,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use('/api', require('./api/routes'));
app.use('/graphql', require('./api/graphql'));
app.use('/*', function (req, res) {
    res.send(require('fs').readFileSync(__dirname + '/../public/index.html', 'utf8'));
});

app.listen(process.env.PORT || 3099, function () {
    console.info(' The app is up on port: ', process.env.PORT || 3099);
});

module.exports = app;
