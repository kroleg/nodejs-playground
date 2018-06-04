'use strict';

const bcrypt = require('bcrypt');

module.exports = {
    encryptPassword (plaintTextPassword, complexity = 10) {
        return bcrypt.hash(plaintTextPassword, complexity)
    },

    validatePassword (plainText, encrypted) {
        return bcrypt.compare(plainText, encrypted);
    }

};