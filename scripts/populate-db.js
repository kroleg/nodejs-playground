'use strict';

const moment = require('moment');
const today = moment().startOf('day')

// data here
const sampleData = [
    {
        calories: 100,
        note: 'tea',
        date: today.valueOf(),
        time: 9 * 60 * 60 * 1000
    },
    {
        calories: 100,
        note: 'coffee',
        date: today.valueOf(),
        time: 1
    },
]
// end of data

const userId = process.argv[2];

if (!userId) {
    // const User = require('../server/api/models/user');
    // find users and list their ids
    console.error(`Please provide userId. Example: "node scripts/populate-db r1g5ak9MgQ"`)
}

sampleData.forEach(row => {
    row.user = userId
})

const { mongoUrl } = require('../server/config')
const mongoose = require('mongoose');
mongoose.connect(mongoUrl);

const Meal = require('../server/api/models/meal');

Meal.create(sampleData)
    .then(() => {
        console.log('Done.')
        process.exit()
    })
