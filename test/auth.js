'use strict';

const chai = require('chai'),
    expect = chai.expect,
    chaiHttp = require('chai-http'),
    api = require('../server/index'),
    { login, createUser, readUser } = require('./_api-requests');

chai.use(chaiHttp);

const User = require('../server/api/models/user');
const testUser = { email: 'user@example.com', password: '123456' };

describe('Auth', function () {

    before(async () => {
        await User.remove({})
    })

    describe('Signup', function () {

        it('should create user', async function () {
            await createUser(chai.request(api), testUser)
            expect(await User.findOne({ email: testUser.email })).to.be.ok
        })
    })

    describe('Login & logout', function () {
        const agent = chai.request.agent(api)

        after(() => agent.close())

        it('should login', async function () {

            await login(agent, testUser)
            const userData = await readUser(agent, 'me')
            expect(userData).to.have.property('email');
        })

        it('should not login with wrong password', async function () {
            const incorrectCredentials = { ...testUser, password: 'wrong password'}
            await login(chai.request(api), incorrectCredentials, 401)
        })

        it('should logout', async function () {
            const logoutResp = await agent.delete('/api/sessions')
            expect(logoutResp).to.have.status(200);
            const userResp = await agent.get('/api/users/me')
            expect(userResp).to.have.status(403);
        })
    })
});
