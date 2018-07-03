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

function graphQLRequest(queryName, variables) {
    const body = JSON.stringify({ query: queries[queryName], variables })
    return fetch('/graphql?n=' + queryName, {...defaultOptions, body, method: 'POST'})
        .then(res => res.json())
        .then(body => {
            if (body.errors) {
                throw new Error(body.errors[0].message)
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
        }`,
    createMeal: `
        mutation CreateMeal ($userId: ID, $input: MealInput) { 
            createMeal(userId: $userId, data: $input) { 
                _id date time note calories
            } 
        }`,
    updateMeal: `
        mutation UpdateMeal ($userId: ID, $mealId: ID, $input: MealInput) { 
            updateMeal(userId: $userId, mealId: $mealId, data: $input) { 
                _id date time note calories
            } 
        }`,
    readMeal: `
        query ReadMeal ($userId: ID, $mealId: ID) { 
            meal(userId: $userId, mealId: $mealId) { 
                _id date time note calories
            } 
        }`,
    deleteMeal: `
        mutation deleteMeal ($userId: ID, $mealId: ID) { 
            deleteMeal(userId: $userId, mealId: $mealId) { 
                _id
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

    meals: {
        list (userId, query = {}) {
            return graphQLRequest('listMeals', { ...query, userId }).then(b => b.meals)
        },
        create (userId, data) {
            return graphQLRequest('createMeal', { userId, input: data }).then(b => b.meal)
        },
        read (userId, mealId) {
            return graphQLRequest('readMeal', { userId, mealId }).then(b => b.meal)
        },
        update (userId, mealId, data) {
            return graphQLRequest('updateMeal', { userId, mealId, input: data }).then(b => b.meal)
        },
        delete (userId, mealId) {
            return graphQLRequest('deleteMeal', { userId, mealId })
        },
    }
}

export default methods