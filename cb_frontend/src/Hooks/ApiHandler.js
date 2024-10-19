import axios from "axios";
import {getUserToken, saveUserToken} from "./UserDataHandler";
import {handleLogout} from "./LoginHandler";

const BASE_URL = process.env.NODE_ENV === 'production' ? 'https://api.crayons.me/api' : 'http://localhost:5000/api'

const api = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    }
});

api.interceptors.request.use((req) => {
        return setReqTokenHeaders(req, getUserToken())
    },
    (err) => Promise.reject(err))

api.interceptors.response.use(
    res => res,
    error => {
        // Handle errors
        const { status } = error.response || {}
        const errCode = error.code

        switch (errCode){
            case 'ECONNABORTED':
                alert("Request timeout. Please try again.")
                return Promise.resolve()
        }

        let errMsg = `ErrCode: ${errCode}, ` + error.response?.data ?? error.message
        let alertMsg

        switch (status) {
            case 400:
                alertMsg = "Bad Request. " + errMsg
                break;
            case 401: //refresh token
                if(errMsg.includes("Expired Token")) return refreshToken(error)
                break
            case 403: //refresh your token
                alertMsg = "Unauthorized: " + errMsg
                handleLogout()
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
    const newAccessToken = await api.get('/user/refreshToken')
    saveUserToken(newAccessToken.data)

    const originalRequest = error.config;
    console.log('resending request with refreshed token: ', originalRequest)
    return await api.request(originalRequest)
}

const apiGet = (endpoint, config) => api.get(endpoint, config)


export default api
export {
    apiGet,
}
