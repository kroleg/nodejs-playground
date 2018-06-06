'use strict';

const moment = require('moment');
const today = moment().startOf('day')

// data generation here
const sampleData = [];
const regularDayMeals = [
    {
        calories: 300,
        note: 'coffee and donut',
        hours: 9
    },
    {
        calories: 700,
        note: 'borsht',
        // date: day.valueOf(),
        hours: 12
    },
    {
        calories: 550,
        note: 'pureshka',
        // date: day.valueOf(),
        hours: 16
    },
]

for (let i = 1; i <= 5; i++) {
    const day = today.clone().subtract(i, 'days');
    const dayMeals = regularDayMeals.map(rm => {
        const m = { ...rm }
        m.date = day.valueOf();
        if (!m.time && m.hours) {
            m.time = m.hours * 60 * 60 * 1000
        }
        return m
    })
    sampleData.push(...dayMeals)
}
// end of data generation

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

console.log(sampleData);

Promise.resolve()
    .then(() => Meal.remove({ user: userId }))
    .then(() => Meal.create(sampleData))
    .then(() => {
        console.log('Done.')
        process.exit()
    })
