import {useTranslation} from "react-i18next";
import {handleLogout} from "../../Hooks/LoginHandler";
import {getUserData} from "../../Hooks/UserDataHandler";
const LoginForm = () => {
    const { t} = useTranslation()

    return <div>
        <button onClick={() => handleLogout()}>Logout</button>
    </div>

}
export default LoginForm