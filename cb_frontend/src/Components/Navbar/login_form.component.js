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
        <form className="login-form" onSubmit={onLogin}>
            <div className="login-field">
                <input
                    className="login-input"
                    type="text"
                    name="email"
                    placeholder="Email"
                    onChange={handleChange}
                />
                <div className="line"></div>
            </div>
            <div className="login-field">
                <input
                    className="login-input"
                    type="password"
                    name="password"
                    placeholder="Password"
                    onChange={handleChange}
                />
                <div className="line"></div>
            </div>
            <input
                className="login-submit"
                type="submit"
                value="Login"
            />
        </form>

    /*<form onSubmit={onLogin}>
        <input type={'text'} name={'email'} onChange={handleChange}/>
        <br/>
        <input type={'password'} name={'password'} onChange={handleChange}/>
        <br/>

        <input type={'submit'} value={'login'}/>
    </form>*/


    return isUserLoggedIn() ? <LogoutComponent/> : loginHTML()

}
export default LoginForm