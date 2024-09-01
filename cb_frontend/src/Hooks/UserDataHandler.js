/**
 * @typedef {Object} UserData
 * @property {string} email - The user's email address.
 * @property {number} credits
 * @property {string} name - The user's full name.
 * @property {string} token - The JWT token for authentication.
 * @property {number} _id
 * */
const USER_DATA = 'auth-user-data'
const BOOK_DATA = 'book-data'


const getUserId = () => getUserData()._id
/**
 * @param {UserData} data
 */
const saveUserData = (data) => {
    localStorage.setItem(USER_DATA, JSON.stringify(data))
}

const updateUserData = (newData) => {
    localStorage.setItem(USER_DATA, JSON.stringify({...getUserData(), ...newData}))
}

/**
 * Retrieves the user data from localStorage.
 * @return {UserData|null} The user data object if available, otherwise null.
 */
const getUserData = () => JSON.parse(localStorage.getItem(USER_DATA))
const removeUserData = () => localStorage.removeItem(USER_DATA)

const isUserLoggedIn = () => getUserData()!==null

const saveBookData = (books) => localStorage.setItem(BOOK_DATA, JSON.stringify(books))

const getBookData = () =>  JSON.parse(localStorage.getItem(BOOK_DATA))

export {
    getUserId,
    saveUserData,
    getUserData,
    removeUserData,
    isUserLoggedIn,
    updateUserData,
    getBookData,
    saveBookData
}