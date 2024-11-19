/**
 * @typedef {Object} UserData
 * @property {string} email - The user's email address.
 * @property {number} credits
 * @property {string} name - The user's full name.
 * @property {string} token - The JWT token for authentication.
 * @property {number} _id
 * */
const USER_DATA = 'cb-auth-user-data'
const TOKEN_DATA = 'cb-auth-user-token'
const BOOK_DATA = 'cb-book-data'
const SHOW_INTRO = 'cb-show-intro'

const shouldShowIntro = () => sessionStorage.getItem(SHOW_INTRO)==='true'
const setShouldShowIntro = (show) => sessionStorage.setItem(SHOW_INTRO, show?'true':'false')

const getUserId = () => getUserData()._id
/**
 * @param {UserData} data
 */
const saveUserData = (data) => {
    console.log('saving user data: ', data)
    localStorage.setItem(USER_DATA, JSON.stringify(data))
}

const updateUserData = (newData) => {
    localStorage.setItem(USER_DATA, JSON.stringify({...getUserData(), ...newData}))
}

const updateUserCredits = (newCredits) => {
    updateUserData({credits: newCredits})
}

/**
 * Retrieves the user data from localStorage.
 * @return {UserData|null} The user data object if available, otherwise null.
 */
const getUserData = () => JSON.parse(localStorage.getItem(USER_DATA))

const removeAllUserData = () => {
    localStorage.removeItem(USER_DATA)
    localStorage.removeItem(BOOK_DATA)
    localStorage.removeItem(TOKEN_DATA)
    localStorage.removeItem(SHOW_INTRO)
}

const isUserLoggedIn = () => getUserData()!==null

const saveBookData = (books) => localStorage.setItem(BOOK_DATA, JSON.stringify(books))

const getBookData = () =>  JSON.parse(localStorage.getItem(BOOK_DATA))

const saveUserToken = (tokenData) => localStorage.setItem(TOKEN_DATA, JSON.stringify(tokenData))

const getUserToken = () => JSON.parse(localStorage.getItem(TOKEN_DATA))


export {
    getUserId,
    saveUserData,
    getUserData,
    removeAllUserData,
    isUserLoggedIn,
    updateUserData,
    getBookData,
    saveBookData,
    saveUserToken,
    getUserToken,
    shouldShowIntro,
    setShouldShowIntro,
    updateUserCredits
}