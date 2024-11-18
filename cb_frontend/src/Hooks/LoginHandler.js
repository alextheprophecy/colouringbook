import api from "./ApiHandler"
import {removeAllUserData, saveUserData, saveUserToken} from "./UserDataHandler";
import store, { resetPersistedState } from "../redux/store";
import { updateCredits } from '../redux/websiteSlice';
const LOGIN_TIMEOUT = 3000

const handleLogin = (loginData) => {
    api.post('user/login', loginData, {timeout: LOGIN_TIMEOUT}).then((r)=> {
        if(!r)return
        const {__v, ...user} = r.data.user
        console.log('user: ', user)
        const tokenData = r.data.token
        saveUserData(user)
        saveUserToken(tokenData)
        store.dispatch(updateCredits(user.credits))

        window.location.href = '/create'
    })
}

const switchAccount = async () => {
    const baseUrl = process.env.NODE_ENV === 'production' 
            ? process.env.REACT_APP_API_URL 
            : 'http://172.20.10.2:5000';
            
    window.location.href = `${baseUrl}/api/user/auth/google?prompt=select_account`;
}

const handleLogout = async () => {    
    try {
        await api.post('user/logout');
    } catch (error) {
        console.error('Logout failed:', error);
    } finally {
        removeAllUserData()
        await resetPersistedState()
        window.location.href = '/';
    }
};

export {
    handleLogin,
    switchAccount,
    handleLogout
}