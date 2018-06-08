const defaultOptions = {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',

    },
    credentials: "same-origin",
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

    async logout () {
        return fetch('/api/sessions', {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
            },
            credentials: "same-origin",
        })
    },

    async createUser (data) {
        const res = await fetch('/api/users', {
            ...defaultOptions,
            method: 'POST',
            body: JSON.stringify(data)
        });
        if (res.status !== 200) {
            const respBody = await res.json();
            throw new Error(respBody.error)
        }
    },

    async updateUser (userId, data) {
        const res = await fetch(`/api/users/${userId}`, {
            ...defaultOptions,
            method: 'PUT',
            body: JSON.stringify(data)
        });
        if (res.status !== 200) {
            const respBody = await res.json();
            throw new Error(respBody.error)
        }
    },

    createMeal (userId, data) {
        return fetch(`/api/users/${userId}/meals`, {
            ...defaultOptions,
            method: 'POST',
            body: JSON.stringify(data),
        })
    },

    updateMeal (userId, mealId, data) {
        return fetch(`/api/users/${userId}/meals/${mealId}`, {
            ...defaultOptions,
            method: 'PUT',
            body: JSON.stringify(data),
        })
    },

    readMeal (userId, mealId) {
        return fetch(`/api/users/${userId}/meals/${mealId}`, defaultOptions).then(res => res.json())
    },

    listMeals (userId, query = {}) {
        const qs = Object.keys(query).map(key => key + '=' + query[key]).join('&')
        return fetch(`/api/users/${userId}/meals` + (qs ? '?' + qs : ''), defaultOptions).then(res => res.json())
    },

    deleteMeal (userId, mealId) {
        return fetch(`/api/users/${userId}/meals/${mealId}`, { ...defaultOptions, method: 'DELETE' })
    },

}

export default methods