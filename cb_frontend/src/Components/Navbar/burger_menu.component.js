import {bubble as Menu } from 'react-burger-menu'
import {Component} from "react";
import '../../Styles/Navbar/burger_menu.css'
import {Link} from "react-router-dom";
import {isUserLoggedIn} from "../../Hooks/UserDataHandler";
import LogoutComponent from "./logout.component";
import {handleLogout} from "../../Hooks/LoginHandler";
class BurgerMenu extends Component{

    login_logout_button () {
        return isUserLoggedIn()? <span onClick={() => handleLogout()}>Logout</span>
            : <Link to={'/login'}>Login</Link>
    }

    render () {
        // NOTE: You also need to provide styles, see https://github.com/negomi/react-burger-menu#styling
        return (
            <div style={{overflow: 'hidden'}}>
            <Menu>
                {this.login_logout_button()}
                <br/>
                <br/>
                <Link to={'/'}>Examples</Link>
                {isUserLoggedIn()?(<Link to={'/gallery'}>My Gallery</Link>):''}
                {isUserLoggedIn()?(<Link to={'/create'}>Generate</Link>):''}
            </Menu>
            </div>
        );
    }
}

export default BurgerMenu