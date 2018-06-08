const defaultOptions = {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',

    },
    credentials: "same-origin",
}

const methods = {



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

}

export default methods