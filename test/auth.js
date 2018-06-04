'use strict';

const chai = require('chai'),
    expect = chai.expect,
    chaiHttp = require('chai-http'),
    api = require('../server');

chai.use(chaiHttp);

const User = require('../server/api/models/user');
const cookieName = 'connect.sid'

describe('Auth', function () {

    before(async () => {
        await User.remove({})
    })

    describe('Signup', function () {
        it('should create user and return valid session', async function () {
            const email = 'user@example.com';
            const resp = await chai.request(api).post('/api/users').send({email, password: '123456'})
            expect(resp).to.have.status(200);
            expect(await User.findOne({email})).to.be.ok
            expect(resp).to.have.cookie(cookieName)
        })
    })

    describe('Login', function () {
        it('should login', async function () {
            // const agent = .agent(api)
            const resp = await chai.request(api).post('/api/sessions').send({ email: 'user@example.com', password: '123456' })
            expect(resp).to.have.status(200);
            expect(resp).to.have.cookie(cookieName);
            // The `agent` now has the sessionid cookie saved, and will send it
            // back to the server in the next request:
            // return agent.get('/users/me')
            //     .then(function (res) {
            //         expect(res).to.have.status(200);
            //     });

        })
    })
});
