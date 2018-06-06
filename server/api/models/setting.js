'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const schema = new Schema(
    {
        caloriesPerDay: Number,
        user: String
    },
    {
        strict: true,
        versionKey: false
    }
);

module.exports = mongoose.model('Setting', schema);
