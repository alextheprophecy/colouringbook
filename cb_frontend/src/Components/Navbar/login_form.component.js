import {useTranslation} from "react-i18next";
import {useState} from "react";
import {handleLogin, handleLogout} from "../../Hooks/LoginHandler";
import {getUserData, isUserLoggedIn} from "../../Hooks/UserDataHandler";
import LogoutComponent from "./logout.component";
import '../../Styles/Navbar/login.css'

const LoginForm = () => {
    const { t} = useTranslation()
    const [formData, setFormData] = useState({email: '',password: ''})

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

    const onLogin = (e) => {
        e.preventDefault();
        handleLogin(formData)
    }
    const loginHTML = () =>
        <form onSubmit={onLogin}>
            <input type={'text'} name={'email'} onChange={handleChange}/>
            <br/>
            <input type={'password'} name={'password'} onChange={handleChange}/>
            <br/>

            <input type={'submit'} value={'login'}/>
        </form>


    return <div className={'login-form'}>
        {isUserLoggedIn() ? <LogoutComponent/> : loginHTML()}
    </div>
}
export default LoginForm