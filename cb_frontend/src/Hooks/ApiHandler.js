import axios, {get} from "axios";
import {getUserData} from "./UserDataHandler";

const BASE_URL = 'http://192.168.1.95:5000/api/'

const api = axios.create({baseURL: BASE_URL});

api.interceptors.request.use((req) => {
    const userData = getUserData()
    if(userData)req.headers["token"] = userData.token
    return req
}, (err) => Promise.reject(err))

api.interceptors.response.use(
    res => res,
    error => {
        // Handle errors
        const { status } = error.response || {}

        const errMsg = JSON.stringify(error.response?.data)
        let alertMsg

        switch (status) {
            case 400:
                alertMsg = "Bad Request. " + errMsg
                break;
            case 401:
                alertMsg = "Unauthorized: Please log in again. " + errMsg
                // Optionally redirect to login page
                // window.location.href = "/login";
                break;
            case 404:
                alertMsg = "Not Found. " + errMsg
                break;
            case 500:
                alertMsg = "Server Error. " + errMsg
                break;
            default:
                alertMsg = "An unknown error occurred. " + errMsg
                break;
        }

        alert(alertMsg)
        return Promise.resolve()
    }
)

const apiGet = (endpoint, config) => api.get(endpoint, config)


export default api
export {
    apiGet,
}
