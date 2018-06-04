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
        createdAt: Date,
        note: String,
        calories: Number,
        user: String
    },
    {
        strict: true,
        versionKey: false
    }
);

module.exports = mongoose.model('Meal', schema);
