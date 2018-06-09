'use strict';

const chai = require('chai'),
    expect = chai.expect,
    chaiHttp = require('chai-http'),
    api = require('../../server/index');

chai.use(chaiHttp);

const Meal = require('../../server/api/models/meal');
const User = require('../../server/api/models/user');

describe('Meals', function () {

    before(async () => {
        await Meal.remove({})
    });

    describe('Owned by current user', function () {

        let authenticatedAgent;
        const testUserCredentials = { email: 'test@example.com', password: '123456' };

        before(async () => {
            authenticatedAgent = chai.request.agent(api);
            await authenticatedAgent.post('/api/users').send(testUserCredentials);
        })

        after(() => authenticatedAgent.close())

        it('should add meal', async function () {
            const newMeal = { createdAt: Date.now(), note: '', calories: 100 };
            const resp = await authenticatedAgent.post('/api/users/me/meals').send(newMeal)
            expect(resp.status).to.be.eq(200);
            expect(await Meal.findOne(newMeal).lean()).to.be.ok
        })

        it('should return meals', async function () {
            const resp = await authenticatedAgent.get('/api/users/me/meals');
            expect(resp.status).to.be.eq(200);
            expect(resp).to.be.json;
            expect(resp.body.data).to.be.an('array')
            expect(resp.body.data).to.have.length(1)
        })

        it('should single meal', async function () {
            const user = await User.findOne({ email: testUserCredentials.email })
            const { _id: mealId } = await Meal.findOne({ user: user._id }).lean()

            const resp = await authenticatedAgent.get('/api/users/me/meals/' + mealId);
            expect(resp.status).to.be.eq(200);
            expect(resp).to.be.json;
            expect(resp.body).to.have.property('calories')
            expect(resp.body).to.have.property('note')
        })
    })

    describe('Owned by specified user', function () {

    })

});
