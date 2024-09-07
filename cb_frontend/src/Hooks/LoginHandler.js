import api from "./ApiHandler"
import axios from "axios";
import {removeAllUserData, saveUserData, saveUserToken} from "./UserDataHandler";

const handleLogin = (loginData) => {
    api.post('user/login', loginData).then((r)=> {
        if(!r)return
        const {__v, ...data} = r.data.user
        const tokenData = r.data.token
        console.log('token_Data savd: ', tokenData)
        saveUserData(data)
        saveUserToken(tokenData)
        window.location.href = '/create'
    })
}

const handleLogout = () => {
    removeAllUserData()
    window.location.href = '/login'
}

export {
    handleLogin,
    handleLogout
}