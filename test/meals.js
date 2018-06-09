'use strict';

const chai = require('chai'),
    expect = chai.expect,
    chaiHttp = require('chai-http'),
    moment = require('moment'),
    api = require('../server/index');

chai.use(chaiHttp);

const Meal = require('../server/api/models/meal');
const User = require('../server/api/models/user');
const testUser = { email: 'user@example.com', password: '123456' };

describe('Meals', function () {

    const agent = chai.request.agent(api)

    before(async () => {
        // wipe db; create and login our test user
        await Meal.remove({})
        await User.remove({})
        await agent.post('/api/users').send(testUser)
        await agent.post('/api/sessions').send(testUser)
    })

    after(() => agent.close())
    
    describe('Owned by current user', function () {

        const testMeal = { date: 0, time: 0, note: 'pizza', calories: 1000 }

        it('should add meal', async function () {
            const resp = await agent.post('/api/users/me/meals').send(testMeal)
            expect(resp.status).to.be.eq(200);
            expect(await Meal.findOne(testMeal).lean()).to.be.ok
        })

        it('should return meals', async function () {
            const resp = await agent.get('/api/users/me/meals');
            expect(resp.status).to.be.eq(200);
            expect(resp).to.be.json;
            expect(resp.body).to.be.an('array')
            expect(resp.body).to.have.length(1)
        })

        it('should single meal', async function () {
            const user = await User.findOne({ email: testUser.email })
            const { _id: mealId } = await Meal.findOne({ user: user._id }).lean()

            const resp = await agent.get('/api/users/me/meals/' + mealId);
            expect(resp.status).to.be.eq(200);
            expect(resp).to.be.json;
            expect(resp.body).to.have.property('date', testMeal.date)
            expect(resp.body).to.have.property('time', testMeal.time)
            expect(resp.body).to.have.property('calories', testMeal.calories)
            expect(resp.body).to.have.property('note', testMeal.note)
        })
    })

    describe('Owned by specified user', function () {

    })

});
