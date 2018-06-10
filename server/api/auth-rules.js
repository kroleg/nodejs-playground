module.exports = {
    /**
     * @param user
     * @param user.role
     */
    allowedToCRUDMeals (user) {
        return user.role === 'admin'
    },

    notAllowedToCRUDMeals (user) {
        return !this.allowedToCRUDMeals(user)
    },

    /**
     * @param user
     * @param user.role
     */
    allowedToCRUDUsers (user) {
        return user.role === 'admin' || user.role === 'manager'
    },

    notAllowedToCRUDUsers (user) {
        return !this.allowedToCRUDUsers(user)
    },
}