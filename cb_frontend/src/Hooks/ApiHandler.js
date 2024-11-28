import axios from "axios";
import { getUserToken, saveUserToken } from "./UserDataHandler";
import { handleLogout } from "./LoginHandler";
import store from '../redux/store';
import { addNotification, updateCredits } from '../redux/websiteSlice';
import { updateUserCredits } from "./UserDataHandler";
import i18n from '../i18n';
import { appInsights } from '../utils/appInsights';

const localAddress = 'localhost'
const BASE_URL = process.env.NODE_ENV === 'production' ? 'https://api.crayons.me/api' : `http://${localAddress}:5000/api`;

const api = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    }
});

const showErrorNotification = (errMsg='An unexpected error occurred') => {
    store.dispatch(addNotification({
        type: 'error',
        message: errMsg,
        duration: 5000
    }));
};

const trackApiError = (error, endpoint) => {
    if (error.response?.status === 401) return;
    
    appInsights.trackException({
        error: new Error(`API Error: ${endpoint}`),
        properties: {
            status: error.response?.status,
            endpoint,
            errorMessage: error.response?.data?.error || error.message,
            errorCode: error.code
        },
        severityLevel: 2
    });
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
            res.data = restData;
        }
        return res;
    },
    error => {
        const { status } = error.response || {}
        const errCode = error.code
        const endpoint = error.config?.url || 'unknown_endpoint';

        if (errCode === 'ECONNABORTED') {
            trackApiError(error, endpoint);
            showErrorNotification('Request timeout');
            return Promise.reject(error);
        }

        let errMsg = error.response?.data?.error || 
                    error.response?.data?.message ||
                    error.message || 
                    'An unexpected error occurred';

        switch (status) {
            case 401:
                if(errMsg.includes('Expired Token')) return refreshToken(error);
                break;
            case 403:      
                showErrorNotification(errMsg);          
                return handleLogout();
            default:
                if (status !== 401 && status !== 403) {
                    trackApiError(error, endpoint);
                }
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
        const newAccessToken = await api.get('/user/refreshToken', {
            withCredentials: true
        });

        if (newAccessToken.data) {
            saveUserToken(newAccessToken.data);
            const originalRequest = error.config;
            originalRequest.headers['Authorization'] = `Bearer ${newAccessToken.data}`;
            return await axios(originalRequest);
        }
    } catch (refreshError) {        
        await handleLogout();
        alert(i18n.t('error.api.session-expired'));
        store.dispatch(addNotification({
            type: 'error',
            message: i18n.t('error.api.session-expired'),
            duration: 5000
        }));
        return Promise.reject(refreshError);
    }
}

const apiGet = (endpoint, config) => api.get(endpoint, config);

export default api;
export {
    apiGet,
};
