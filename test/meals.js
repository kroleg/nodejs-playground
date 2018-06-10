'use strict';

const chai = require('chai'),
    expect = chai.expect,
    chaiHttp = require('chai-http'),
    { login, createUser, createMeal, updateMeal, listMeals, readMeal, deleteMeal } = require('./_api-requests'),
    api = require('../server/index');

chai.use(chaiHttp);

const Meal = require('../server/api/models/meal');
const User = require('../server/api/models/user');


describe('Meals', function () {

    describe('Owned by current user (me)', function () {
        const meAgent = chai.request.agent(api)
        const testMeal = { date: 0, time: 0, note: 'pizza', calories: 1000 }
        const testUser = { email: 'user@example.com', password: '123456' };

        before(async () => {
            // wipe db; create and login our test user
            await Meal.remove({})
            await User.remove({})
            await createUser(meAgent, testUser)
            await login(meAgent, testUser)
        })

        after(() => meAgent.close())

        it('should add meal', async function () {
            testMeal._id = (await createMeal(meAgent, 'me', testMeal)).mealId
            expect(await Meal.findOne(testMeal).lean()).to.be.ok
        })

        it('should list meals', async function () {
            const meals = await listMeals(meAgent, 'me')
            expect(meals).to.be.an('array')
            expect(meals).to.have.length(1)
        })

        it('should read single meal', async function () {
            const user = await User.findOne({ email: testUser.email })
            const { _id: mealId } = await Meal.findOne({ user: user._id }).lean()

            const meal = await readMeal(meAgent, 'me', mealId);
            expect(meal).to.have.property('date', testMeal.date)
            expect(meal).to.have.property('time', testMeal.time)
            expect(meal).to.have.property('calories', testMeal.calories)
            expect(meal).to.have.property('note', testMeal.note)
        })

        it('should allow to update meal', async function () {
            const newProps = { date: 1, time: 1, note: 'notpizza', calories: 1 }
            await updateMeal(meAgent, 'me', testMeal._id, newProps)
            const updatedMeal = await readMeal(meAgent, 'me', testMeal._id)
            expect(updatedMeal).to.have.property('date', newProps.date)
            expect(updatedMeal).to.have.property('time', newProps.time)
            expect(updatedMeal).to.have.property('calories', newProps.calories)
            expect(updatedMeal).to.have.property('note', newProps.note)
        })

        it('should allow to remove', async function () {
            return deleteMeal(meAgent, 'me', testMeal._id)
        })
    })

    describe('Owned by specified user', function () {
        const testUser = { email: 'user@example.com', password: '123456' }
        const testMeal = { date: 0, time: 0, note: 'pizza', calories: 1000 }
        const otherUser = { email: 'otheruser@example.com', password: '123456' }
        const agent = chai.request.agent(api)
        const otherUserAgent = chai.request.agent(api)

        before(async () => {
            // wipe db; create and login our test user
            await Meal.remove({})
            await User.remove({})
            await agent.post('/api/users').send(testUser)
            await agent.post('/api/sessions').send(testUser)

            otherUser._id = (await createUser(otherUserAgent, otherUser)).userId
            await login(otherUserAgent, otherUser)
            testMeal._id = (await createMeal(otherUserAgent, 'me', testMeal)).mealId
        })

        after(() => {
            agent.close()
            otherUserAgent.close()
        })

        describe('Requested by regular user', function () {

            it('should not allow to add meal', async function () {
                return createMeal(agent, otherUser._id, testMeal, 403)
            })

            it('should not allow to get list of meals', async function () {
                return listMeals(agent, otherUser._id, 403)
            })

            it('should not allow to update meal', function () {
                return updateMeal(agent, otherUser._id, testMeal._id, {}, 403)
            })

            it('should not allow to read meal', function () {
                return readMeal(agent, otherUser._id, testMeal._id, 403)
            })

            it('should not allow to delete meal', function () {
                return deleteMeal(agent, otherUser._id, testMeal._id, 403)
            })
        })

        describe('Requested by manager', function () {

            const managerAgent = chai.request.agent(api)
            const managerUser = { email: 'manager@example.com', password: '123456' }

            before(async () => {
                await createUser(managerAgent, managerUser, 'manager')
                await login(managerAgent, managerUser)
            })

            after(() => managerAgent.close())

            it('should not allow to add meal', async function () {
                const someOtherMeal = { calories: 100, date: 0, time: 0, note: 'pizza slice' }
                await createMeal(managerAgent, otherUser._id, someOtherMeal, 403)
            })

            it('should not allow to get list of meals', async function () {
                await listMeals(managerAgent, otherUser._id, 403)
            })

            it('should not allow to update meal', async function () {
                await updateMeal(managerAgent, otherUser._id, testMeal._id, {}, 403)
            })

            it('should not allow to read meal', async function () {
                await readMeal(managerAgent, otherUser._id, testMeal._id, 403)
            })

            it('should not allow to delete meal', function () {
                return deleteMeal(managerAgent, otherUser._id, testMeal._id, 403)
            })
        })

        describe('Requested by admin', function () {

            let adminAgent = chai.request.agent(api)
            const adminUser = { email: 'admin@example.com', password: '123456' }
            const someOtherMeal = { calories: 100, date: 0, time: 0, note: 'pizza slice' }

            before(async () => {
                await createUser(adminAgent, adminUser, 'admin')
                await login(adminAgent, adminUser)
            })

            after(() => adminAgent.close())

            it('should allow to add', async function () {
                someOtherMeal._id = (await createMeal(adminAgent, otherUser._id, someOtherMeal)).mealId
            })

            it('should allow to get list of meals', async function () {
                await listMeals(adminAgent, otherUser._id)
            })

            it('should allow to read meal', async function () {
                await readMeal(adminAgent, otherUser._id, someOtherMeal._id)
            })

            it('should allow to update meal', async function () {
                const newProps = { date: 1, time: 1, note: 'notpizza', calories: 1 }
                await updateMeal(adminAgent, otherUser._id, someOtherMeal._id, newProps)
                const updatedMeal = await readMeal(adminAgent, otherUser._id, someOtherMeal._id)
                expect(updatedMeal).to.have.property('date', newProps.date)
                expect(updatedMeal).to.have.property('time', newProps.time)
                expect(updatedMeal).to.have.property('calories', newProps.calories)
                expect(updatedMeal).to.have.property('note', newProps.note)
            })

            it('should allow to remove', async function () {
                return deleteMeal(adminAgent, otherUser._id, someOtherMeal._id)
            })
        })
    })

});
