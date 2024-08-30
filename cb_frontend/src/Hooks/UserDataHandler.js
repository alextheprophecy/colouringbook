/**
 * @typedef {Object} UserData
 * @property {string} email - The user's email address.
 * @property {string} name - The user's full name.
 * @property {string} token - The JWT token for authentication.
 */
const USER_DATA = 'auth-user-data'

/**
 * @param {UserData} data
 */
const saveUserData = (data) => localStorage.setItem(USER_DATA, JSON.stringify(data))

/**
 * Retrieves the user data from localStorage.
 * @return {UserData|null} The user data object if available, otherwise null.
 */
const getUserData = () => {
    return JSON.parse(localStorage.getItem(USER_DATA))
}
const removeUserData = () => localStorage.removeItem(USER_DATA)

const isUserLoggedIn = () => getUserData()!==null

export {
    saveUserData,
    getUserData,
    removeUserData,
    isUserLoggedIn
}