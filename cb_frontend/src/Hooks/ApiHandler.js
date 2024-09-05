import axios, {get} from "axios";
import {getUserData, getUserToken, saveUserToken} from "./UserDataHandler";

const BASE_URL = 'http://localhost:5000/api/'

const api = axios.create({baseURL: BASE_URL, withCredentials: true}); //, withCredentials: true

api.interceptors.request.use((req) => {
        return setReqTokenHeaders(req, getUserToken())
    },
    (err) => Promise.reject(err))

api.interceptors.response.use(
    res => res,
    error => {
        // Handle errors
        const { status } = error.response || {}

        let errMsg = error.response?.data
        if(!errMsg) errMsg = error.response.error
        errMsg = JSON.stringify(errMsg)

        let alertMsg

        switch (status) {
            case 400:
                alertMsg = "Bad Request. " + errMsg
                break;
            case 401: //refresh token
                alertMsg = "Unauthorized: " + errMsg
                if(errMsg.startsWith("Expired Token")) return refreshToken(error)
                break;
            case 403: //refresh your token
                alertMsg = "Unauthorized: " + errMsg
                window.location.href = '/login'
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

const setReqTokenHeaders = (req, token) => {
    if(token) req.headers.authorization = `Bearer ${token}`
    return req
}

const refreshToken = async (error) => {
    const newAccessTokens = await api.get('/user/refreshTokens')
    saveUserToken(newAccessTokens.data)

    const originalRequest = error.config;
    console.log('resending request with refreshed token: ', originalRequest)
    return await api.request(originalRequest)
}

const apiGet = (endpoint, config) => api.get(endpoint, config)


export default api
export {
    apiGet,
}
