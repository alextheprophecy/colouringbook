import axios from "axios";
import { useTranslation } from 'react-i18next';
import { getUserToken, saveUserToken } from "./UserDataHandler";
import { handleLogout } from "./LoginHandler";
import store from '../redux/store';
import { addNotification, updateCredits } from '../redux/websiteSlice';
import { updateUserCredits } from "./UserDataHandler";
import i18n from '../i18n'; // Adjust the path based on your project structure
const localAddress = '172.20.10.2'//'localhost'
const BASE_URL = process.env.NODE_ENV === 'production' ? 'https://api.crayons.me/api' : `http://${localAddress}:5000/api`;

const api = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    }
});

const showErrorNotification = (errMsg) => {
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
            showErrorNotification(i18n.t('error.api.request-timeout'));
            return Promise.reject(error);
        }

        let errMsg = error.response?.data?.error || 
                    error.response?.data || 
                    error.message || 
                    i18n.t('error.an-unexpected-error-occurred');
 
        switch (status) {
            case 401:
                if(errMsg.includes('Expired Token')) return refreshToken(error);
                break;
            case 403:
                showErrorNotification(errMsg);
                //handleLogout();
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
    try {
        const newAccessToken = await api.get('/user/refreshToken');
        saveUserToken(newAccessToken.data);

        const originalRequest = error.config;
        return await api.request(originalRequest);
    } catch (refreshError) {
        store.dispatch(addNotification({
            type: 'error',
            message: i18n.t('error.api.session-expired'), // Use i18n.t for translations
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
