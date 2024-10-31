import axios from "axios";
import { getUserToken, saveUserToken } from "./UserDataHandler";
import { handleLogout } from "./LoginHandler";
import store from '../redux/store';
import { addNotification, updateCredits } from '../redux/websiteSlice';

const localAddress = '172.20.10.2'//'localhost'
const BASE_URL = process.env.NODE_ENV === 'production' ? 'https://api.crayons.me/api' : `http://${localAddress}:5000/api`;

const api = axios.create({baseURL: BASE_URL, withCredentials: true});

api.interceptors.request.use((req) => {
    return setReqTokenHeaders(req, getUserToken())
}, (err) => Promise.reject(err));

api.interceptors.response.use(
    res => {
        if (res.data?.credits !== undefined) {
            store.dispatch(updateCredits(res.data.credits));
        }
        return res;
    },
    error => {
        const { status } = error.response || {}
        const errCode = error.code

        if (errCode === 'ECONNABORTED') {
            store.dispatch(addNotification({
                type: 'error',
                message: "Request timeout. Please try again.",
                duration: 5000
            }));
            return Promise.reject(error);
        }

        let errMsg = error.response?.data?.error || 
                    error.response?.data || 
                    error.message || 
                    'An unexpected error occurred';

        switch (status) {
            case 400:
                store.dispatch(addNotification({
                    type: 'error',
                    message: errMsg,
                    duration: 5000
                }));
                break;
            case 401:
                if(errMsg.includes("Expired Token")) return refreshToken(error);
                break;
            case 403:
                store.dispatch(addNotification({
                    type: 'error',
                    message: errMsg,
                    duration: 5000
                }));
                handleLogout();
                break;
            case 404:
                store.dispatch(addNotification({
                    type: 'error',
                    message: errMsg,
                    duration: 5000
                }));
                break;
            case 500:
                store.dispatch(addNotification({
                    type: 'error',
                    message: errMsg,
                    duration: 5000
                }));
                break;
            default:
                store.dispatch(addNotification({
                    type: 'error',
                    message: errMsg,
                    duration: 5000
                }));
                break;
        }

        return Promise.reject(error);
    }
);

const setReqTokenHeaders = (req, token) => {
    if(token) req.headers.authorization = `Bearer ${token}`;
    return req;
}

const refreshToken = async (error) => {
    try {
        const newAccessToken = await api.get('/user/refreshToken');
        saveUserToken(newAccessToken.data);

        const originalRequest = error.config;
        return await api.request(originalRequest);
    } catch (refreshError) {
        store.dispatch(addNotification({
            type: 'error',
            message: 'Session expired. Please login again.',
            duration: 5000
        }));
        handleLogout();
        return Promise.reject(refreshError);
    }
}

const apiGet = (endpoint, config) => api.get(endpoint, config);

export default api;
export {
    apiGet,
};
