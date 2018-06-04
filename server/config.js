'use strict';

module.exports = {
    mongoUrl: process.env.MONGO_URL || 'mongodb://localhost/toptal-ts',
    redisStore: {
        url: process.env.REDIS_URL || '',
        secret: 'somesecretphrase'
    }
};
