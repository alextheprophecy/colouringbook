import api from "./ApiHandler"
import axios from "axios";
import {removeUserData, saveUserData} from "./UserDataHandler";

const handleLogin = (loginData) => {
    api.post('user/login', loginData).then((r)=> {
        if(!r)return
        const {__v, ...data} = r.data.user

        saveUserData(data)
        window.location.reload()
    })
}

const handleLogout = () =>{
    removeUserData()
    window.location.reload()
}

export {
    handleLogin,
    handleLogout
}