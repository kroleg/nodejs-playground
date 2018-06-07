'use strict';

const shortid = require('shortid');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const schema = new Schema(
    {
        _id: {
            type: String,
            'default': shortid.generate
        },
        email: String,
        encryptedPassword: String,
        role: {
            type: String,
            default: 'regular',
            enum: ['regular', 'manager', 'admin']
        },
    },
    {
        strict: true,
        versionKey: false
    }
);

module.exports = mongoose.model('User', schema);
