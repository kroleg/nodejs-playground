'use strict';

const chai = require('chai'),
    expect = chai.expect,
    chaiHttp = require('chai-http'),
    { login, createUser, readUser, listUsers, updateUser, deleteUser } = require('./_api-requests'),
    api = require('../server/index');

chai.use(chaiHttp);

const Meal = require('../server/api/models/meal');
const User = require('../server/api/models/user');

describe('Users', function () {

    ['admin', 'manager'].forEach(powerUserRole => {

         describe(powerUserRole ,function () {

             before(async () => {
                 await Meal.remove({})
                 await User.remove({})
             })

             const powerUserAgent = chai.request.agent(api)
             const powerUser = { email: 'power@example.com', password: '123456' }
             const testUser = { email: 'test@example.com', password: '123456' }

             before(async () => {
                 powerUser._id = (await createUser(powerUserAgent, powerUser, powerUserRole)).userId
                 await login(powerUserAgent, powerUser)
             })

             it('should create user', async function () {
                 // anyone can create regular user
                 testUser._id = (await createUser(powerUserAgent, testUser)).userId
             })

             it('should read user', async function () {
                 const user = await readUser(powerUserAgent, testUser._id)
                 expect(user).to.have.property('role', 'regular')
                 expect(user).to.have.property('email', testUser.email)
                 // todo expect(user).to.have.property('settings')
                 expect(user).to.not.have.property('encryptedPassword')
                 expect(user).to.not.have.property('password')
             })

             it('should list users', async function () {
                 const users = await listUsers(powerUserAgent)
                 expect(users).to.be.an('array')
                 expect(users).to.have.length(2)

                 const tUser = users.find(u => u.email === testUser.email)
                 expect(tUser).to.have.property('role', 'regular')
                 expect(tUser).to.not.have.property('encryptedPassword')
                 expect(tUser).to.not.have.property('password')

                 const adminUserData = users.find(u => u.email === powerUser.email)
                 expect(adminUserData).to.have.property('role', powerUserRole)
                 expect(adminUserData).to.not.have.property('encryptedPassword')
                 expect(adminUserData).to.not.have.property('password')
             })

             it('should update user', async function () {
                 const newProps = { email: 'testnew@example.com', role: 'admin' }
                 await updateUser(powerUserAgent, testUser._id, newProps)
                 const updatedUser = await readUser(powerUserAgent, testUser._id)
                 expect(updatedUser).to.have.property('role', newProps.role)
                 expect(updatedUser).to.have.property('email', newProps.email)
             })

             it('should not allow to change email to email of other user', async function () {
                 const newProps = { email: 'power@example.com' }
                 await updateUser(powerUserAgent, testUser._id, newProps, 422)
             })

             it('should delete user', async function () {
                 await deleteUser(powerUserAgent, testUser._id)
             })

             it('should not allow to delete self', async function () {
                 await deleteUser(powerUserAgent, powerUser._id, 422)
             })
         })
    })


    describe('Regular user', function () {

        const regularUserAgent = chai.request.agent(api)
        const regularUser = { email: 'power@example.com', password: '123456' }
        const testUser = { email: 'test@example.com', password: '123456' }

        before(async () => {
            await Meal.remove({})
            await User.remove({})
            testUser._id = (await createUser(regularUserAgent, testUser)).userId
            regularUser._id = (await createUser(regularUserAgent, regularUser)).userId
            await login(regularUserAgent, regularUser)
        })

        it('should not allow to read user', async function () {
            await readUser(regularUserAgent, testUser._id, 403)
        })

        it('should not allow to list users', async function () {
            await listUsers(regularUserAgent, 403)
        })

        it('should not allow to update user', async function () {
            await updateUser(regularUserAgent, testUser._id, {}, 403)
        })

        it('should not allow to delete user', async function () {
            await deleteUser(regularUserAgent, testUser._id, 403)
        })

        it('should not allow to delete self', async function () {
            await deleteUser(regularUserAgent, regularUser._id, 422)
        })
    })

});
