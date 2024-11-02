import {useTranslation} from "react-i18next";
import {useState} from "react";
import {handleLogin, handleLogout} from "../../Hooks/LoginHandler";
import {getUserData, isUserLoggedIn} from "../../Hooks/UserDataHandler";
import LogoutComponent from "../Navbar/logout.component";
import '../../Styles/Navbar/login.css'

const LoginView = () => {
    const { t } = useTranslation()
    const [formData, setFormData] = useState({email: '',password: ''})

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

    const onLogin = (e) => {
        e.preventDefault();
        handleLogin(formData)
    }
    const loginHTML = () =>
        <form className="login-form" onSubmit={onLogin}>
            <div className="login-field">
                <input
                    className="login-input"
                    type="text"
                    name="email"
                    placeholder={t('login.email')}
                    onChange={handleChange}
                />
            </div>
            <div className="login-field">
                <input
                    className="login-input"
                    type="password"
                    name="password"
                    placeholder={t('login.password')}
                    onChange={handleChange}
                />
            </div>
            <input
                className="login-submit"
                type="submit"
                value={t('login.login')}
            />
        </form>

    /*<form onSubmit={onLogin}>
        <input type={'text'} name={'email'} onChange={handleChange}/>
        <br/>
        <input type={'password'} name={'password'} onChange={handleChange}/>
        <br/>

        <input type={'submit'} value={'login'}/>
    </form>*/


    return isUserLoggedIn() ? <LogoutComponent/>: loginHTML()

}
export default LoginView