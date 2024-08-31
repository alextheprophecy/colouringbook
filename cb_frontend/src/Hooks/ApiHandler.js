import axios, {get} from "axios";
import {getUserData} from "./UserDataHandler";

const BASE_URL = 'http://localhost:5000/api/'

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

        switch (status) {
            case 400:
                console.log("Bad Request", error.response?.data);
                break;
            case 401:
                console.log("Unauthorized: Please log in again.");
                // Optionally redirect to login page
                // window.location.href = "/login";
                break;
            case 404:
                console.log("Not Found", error.response?.data);
                break;
            case 500:
                console.log("Server Error", error.response?.data);
                break;
            default:
                console.log("An unknown error occurred", error.response?.data);
                break;
        }

        alert(JSON.stringify(error.response?.data))
        return Promise.resolve()
    }
)

const apiGet = (endpoint, config) => api.get(endpoint, config)


export default api
export {
    apiGet,
}
