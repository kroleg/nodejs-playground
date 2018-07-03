const defaultOptions = {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',

    },
    credentials: "same-origin",
}

function fetchOrThrow (url, options = defaultOptions) {
    return fetch(url, options).then(async res => {
        const body = await res.json()
        if (res.status === 200 || res.status === 201) {
            return body
        }
        //todo better handle 401 = no rights, 403 = no auth
        throw new Error(body.error)
    })
}

function graphQLRequest(query, variables) {
    const body = JSON.stringify({ query: queries.listMeals, variables })
    return fetch('/graphql', {...defaultOptions, body, method: 'POST'})
        .then(res => res.json())
        .then(body => {
            if (body.errors) {
                throw body.errors
            }
            return body.data
        })
}

const queries = {
    listMeals: `
        query getMeals ($userId: ID, $dateFrom: Float, $dateTo: Float) { 
            meals(userId: $userId, dateFrom: $dateFrom, dateTo: $dateTo) { 
                _id date time note calories 
            } 
        }`
}

const methods = {

    async getCurrentUser () {
        return fetch('/api/users/me', defaultOptions).then(res => {
            if (res.status === 200) {
                return res.json()
            }
            throw new Error('Failed ') // text doesn't because not used in consumer
        })
    },

    async login (credentials) {
        const res = await fetch('/api/sessions', {
            ...defaultOptions,
            method: 'POST',
            body: JSON.stringify(credentials)
        });
        if (res.status !== 200) {
            const respBody = await res.json();
            throw new Error(respBody.error)
        }
    },

    logout () {
        return fetchOrThrow('/api/sessions', { ...defaultOptions, method: 'DELETE' })
    },

    createUser (data) {
        return fetchOrThrow('/api/users', {...defaultOptions, method: 'POST', body: JSON.stringify(data)})
    },

    updateUser (userId, data) {
        return fetchOrThrow(`/api/users/${userId}`, {...defaultOptions, method: 'PATCH', body: JSON.stringify(data)})
    },

    readUser (userId) {
        return fetchOrThrow(`/api/users/${userId}`)
    },

    deleteUser (userId) {
        return fetchOrThrow(`/api/users/${userId}`, { ...defaultOptions, method: 'DELETE' })
    },

    listUsers () {
        return fetchOrThrow('/api/users')
    },

    createMeal (userId, data) {
        return fetchOrThrow(`/api/users/${userId}/meals`, {...defaultOptions, method: 'POST', body: JSON.stringify(data)})
    },

    updateMeal (userId, mealId, data) {
        return fetchOrThrow(`/api/users/${userId}/meals/${mealId}`, {...defaultOptions, method: 'PATCH', body: JSON.stringify(data)})
    },

    readMeal (userId, mealId) {
        return fetchOrThrow(`/api/users/${userId}/meals/${mealId}`)
    },

    listMeals (userId, query = {}) {
        return graphQLRequest(queries.listMeals, { ...query, userId }).then(b => b.meals)
    },

    deleteMeal (userId, mealId) {
        return fetchOrThrow(`/api/users/${userId}/meals/${mealId}`, { ...defaultOptions, method: 'DELETE' })
    },

}

export default methods