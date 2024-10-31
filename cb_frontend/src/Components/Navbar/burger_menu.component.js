import {bubble as Menu } from 'react-burger-menu'
import {Component} from "react";
import '../../Styles/Navbar/burger_menu.css'
import {Link} from "react-router-dom";
import {isUserLoggedIn} from "../../Hooks/UserDataHandler";
import {handleLogout} from "../../Hooks/LoginHandler";

class BurgerMenu extends Component{
    constructor(props) {
        super(props)
        this.state = {isOpen: false}
    }
    
    toggleMenu = () => {
        this.setState(prevState => ({ isOpen: !prevState.isOpen }))
    }

    closeMenu = () => {
        this.setState({ isOpen: false})
    }

    login_logout_button = () =>
        isUserLoggedIn() ?
            <span className="bm-item bm-item-logout" onClick={() => handleLogout()}>Logout</span> :
            this.getMenuLink('/login', 'Login')

    getMenuLink = (url, name) => (
        <Link 
            onClick={this.closeMenu} 
            to={url}
            className="bm-item"
        >
            {name}
        </Link>
    )

    render () {
        return (
            <div className="burger-menu-wrapper">
                <Menu 
                    isOpen={this.state.isOpen} 
                    onOpen={this.toggleMenu} 
                    onClose={this.toggleMenu}
                    burgerButtonClassName="burger-button"
                    burgerBarClassName="burger-bars"
                    crossButtonClassName="cross-button"
                    crossClassName="cross"
                >
                    {this.login_logout_button()}
                    <br/>
                    <br/>
                    {this.getMenuLink('/', 'Home')}
                    {isUserLoggedIn() ? this.getMenuLink('/create', 'Create') : ''}
                    {isUserLoggedIn() ? this.getMenuLink('/gallery', 'My Gallery') : ''}
                </Menu>
            </div>
        );
    }
}

export default BurgerMenu;