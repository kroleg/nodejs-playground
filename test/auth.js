'use strict';

const chai = require('chai'),
    expect = chai.expect,
    chaiHttp = require('chai-http'),
    api = require('../server/index');

chai.use(chaiHttp);

const User = require('../server/api/models/user');
const cookieName = 'connect.sid'
const testUser = { email: 'user@example.com', password: '123456' };

describe('Auth', function () {

    before(async () => {
        await User.remove({})
    })

    describe('Signup', function () {
        it('should create user', async function () {
            const resp = await chai.request(api).post('/api/users').send(testUser)
            expect(resp).to.have.status(201);
            expect(await User.findOne({ email: testUser.email })).to.be.ok
        })
    })

    describe('Login & logout', function () {
        const agent = chai.request.agent(api)

        it('should login', async function () {
            const loginResp = await agent.post('/api/sessions').send(testUser)
            expect(loginResp).to.have.status(200);
            expect(loginResp).to.have.cookie(cookieName);
            const userResp = await agent.get('/api/users/me')
            expect(userResp).to.have.status(200);
            expect(userResp.body).to.have.property('email');
        })

        it('should not login with wrong password', async function () {
            const incorrectCredentials = { ...testUser, password: 'wrong password'}
            const loginResp = await agent.post('/api/sessions').send(incorrectCredentials)
            expect(loginResp).to.have.status(401);
        })

        it('should logout', async function () {
            const logoutResp = await agent.delete('/api/sessions')
            expect(logoutResp).to.have.status(200);
            const userResp = await agent.get('/api/users/me')
            expect(userResp).to.have.status(403);
        })
    })
});
