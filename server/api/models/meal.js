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
        date: Number, // unix timestamp in ms of start of day (0:00:00)
        time: Number, // number of miliseconds from day start
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
