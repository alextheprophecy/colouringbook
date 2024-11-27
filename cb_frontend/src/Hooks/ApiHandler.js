import axios from "axios";
import { useTranslation } from 'react-i18next';
import { getUserToken, saveUserToken } from "./UserDataHandler";
import { handleLogout } from "./LoginHandler";
import store from '../redux/store';
import { addNotification, updateCredits } from '../redux/websiteSlice';
import { updateUserCredits } from "./UserDataHandler";
import i18n from '../i18n'; // Adjust the path based on your project structure
const localAddress = 'localhost'//'localhost'
const BASE_URL = process.env.NODE_ENV === 'production' ? 'https://api.crayons.me/api' : `http://${localAddress}:5000/api`;

const api = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

const showErrorNotification = (errMsg='An unexpected error occurred') => {
    store.dispatch(addNotification({
        type: 'error',
        message: errMsg,
        duration: 5000
    }));
};

api.interceptors.request.use((req) => {
    return setReqTokenHeaders(req, getUserToken())
}, (err) => Promise.reject(err));


api.interceptors.response.use(
    res => {
        if (res.data?.credits !== undefined) {         
            const { credits, ...restData } = res.data;
            store.dispatch(updateCredits(credits));
            updateUserCredits(credits);
            console.log('restData from interceptor', restData);
            res.data = restData;
        }
        return res;
    },
    error => {
        const { status } = error.response || {}
        const errCode = error.code

        if (errCode === 'ECONNABORTED') {
            showErrorNotification('Request timeout');
            return Promise.reject(error);
        }

        let errMsg = error.response?.data?.error || error.response?.data?.message ||
                    error.message || 'An unexpected error occurred';
        console.log('errMsg', errMsg);
        switch (status) {
            case 401:
                if(errMsg.includes('Expired Token')){
                    console.log('refreshing token');
                    return refreshToken(error);
                }
                break;
            case 403:
                showErrorNotification(errMsg);
                if(errMsg.includes('Refresh Token'))handleLogout();
                break;
            default:
                showErrorNotification(errMsg);
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
    console.log('Attempting token refresh');
    try {
        const newAccessToken = await api.get('/user/refreshToken', {
            withCredentials: true
        });
        
        console.log('Refresh token response:', newAccessToken);
        
        if (newAccessToken.data) {
            saveUserToken(newAccessToken.data);
            
            const originalRequest = error.config;
            originalRequest.headers['Authorization'] = `Bearer ${newAccessToken.data}`;
            return await axios(originalRequest);
        }
    } catch (refreshError) {
        console.error('Refresh token error:', refreshError);
        if (refreshError.response?.status === 401 || refreshError.response?.status === 403) {
            handleLogout();
        }
        return Promise.reject(refreshError);
    }
}

const apiGet = (endpoint, config) => api.get(endpoint, config);

export default api;
export {
    apiGet,
};
