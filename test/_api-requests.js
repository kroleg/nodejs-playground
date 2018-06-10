'use strict';

const chai = require('chai'),
    expect = chai.expect,
    chaiHttp = require('chai-http'),
    User = require('../server/api/models/user');

chai.use(chaiHttp);

const sessionCookieName = 'connect.sid'

module.exports = {

    /**
     * @returns {TestAgent}
     */
    async login (agent, user) {
        const loginResp = await agent.post('/api/sessions').send(user)
        expect(loginResp).to.have.status(200);
        expect(loginResp).to.have.cookie(sessionCookieName);
    },

    async createUser (agent, userData, role, expectStatus = 201) {
        const user = await requestApi(agent, 'post', `/api/users`, userData, expectStatus)
        if (role) {
            await User.update({ _id:  user.userId }, { role })
            user.role = role
        }
        return user
    },

    async readUser (agent, userId, expectStatus = 200) {
        ensureType(userId, 'string')
        ensureType(expectStatus, 'number')
        return requestApi(agent, 'get', `/api/users/${userId}`, null, expectStatus)
    },

    async listUsers (agent, expectStatus = 200) {
        ensureType(expectStatus, 'number')
        return requestApi(agent, 'get', `/api/users`, null, expectStatus)
    },

    async updateUser (agent, userId, newProps, expectStatus = 200) {
        ensureType(userId, 'string')
        ensureType(newProps, 'object')
        ensureType(expectStatus, 'number')
        return requestApi(agent, 'patch', `/api/users/${userId}`, newProps, expectStatus)
    },

    async deleteUser (agent, userId, expectStatus = 200) {
        ensureType(userId, 'string')
        ensureType(expectStatus, 'number')
        return requestApi(agent, 'delete', `/api/users/${userId}`, null, expectStatus)
    },

    async listMeals (agent, userId, expectStatus = 200) {
        ensureType(userId, 'string')
        return requestApi(agent, 'get', `/api/users/${userId}/meals`, null, expectStatus)
    },

    async createMeal (agent, userId, meal, expectStatus = 201) {
        ensureType(userId, 'string')
        ensureType(meal, 'object')
        ensureType(expectStatus, 'number')
        return requestApi(agent, 'post', `/api/users/${userId}/meals`, meal, expectStatus)
    },

    async readMeal (agent, userId, mealId, expectStatus = 200) {
        ensureType(userId, 'string')
        ensureType(mealId, 'string')
        ensureType(expectStatus, 'number')
        return requestApi(agent, 'get', `/api/users/${userId}/meals/${mealId}`, null, expectStatus)
    },

    async updateMeal (agent, userId, mealId, newProps, expectStatus = 200) {
        ensureType(userId, 'string')
        ensureType(mealId, 'string')
        ensureType(newProps, 'object')
        ensureType(expectStatus, 'number')
        return requestApi(agent, 'patch', `/api/users/${userId}/meals/${mealId}`, newProps, expectStatus)
    },

    async deleteMeal (agent, userId, mealId, expectStatus = 200) {
        ensureType(userId, 'string')
        ensureType(mealId, 'string')
        ensureType(expectStatus, 'number')
        return requestApi(agent, 'delete', `/api/users/${userId}/meals/${mealId}`, null, expectStatus)
    }
}

async function requestApi(agent, method, url, body, expectedStatus) {
    const req = agent[method](url)
    if (body) {
        req.send(body)
    }
    const res = await req
    expect(res).to.have.status(expectedStatus)
    return res.body
}

function ensureType(variable, type) {
    expect(variable).to.be.a(type)
}
