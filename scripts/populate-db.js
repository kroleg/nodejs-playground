'use strict';

const moment = require('moment');
const today = moment().startOf('day')
const { encryptPassword } = require('../server/api/controllers/helpers/password')

const User = require('../server/api/models/user');

const meals = [];
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
    meals.push(...dayMeals)
}
// end of data generation

const { mongoUrl } = require('../server/config')
const mongoose = require('mongoose');
mongoose.connect(mongoUrl);

const Meal = require('../server/api/models/meal');

Promise.resolve()
    .then(async () => {
        await User.remove({})
        const encryptedPassword = await encryptPassword('123456')
        const users = ['admin', 'regular', 'manager'].map(role => ({
            encryptedPassword, role, email: role + '@example.com'
        }))
        console.log(users)
        await User.create(users)

        const regularUser = await User.findOne({ role: 'regular' })
        meals.forEach(row => {
            row.user = regularUser._id
        })
        await Meal.create(meals)
    })
    .then(() => {
        console.log('Done.')
        process.exit()
    })
    .catch(err => {
        console.error(err)
        process.exit()
    })
