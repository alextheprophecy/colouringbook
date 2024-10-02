import {bubble as Menu } from 'react-burger-menu'
import {Component, useState} from "react";
import '../../Styles/Navbar/burger_menu.css'
import {Link} from "react-router-dom";
import {isUserLoggedIn} from "../../Hooks/UserDataHandler";
import LogoutComponent from "./logout.component";
import {handleLogout} from "../../Hooks/LoginHandler";
import ScribbleText from "../UI/ui_scribble_text.component";

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
            <span onClick={() => handleLogout()}>Logout</span> :
            this.getMenuLink('/login', 'Login')


    getMenuLink = (url, name) => <Link onClick={this.closeMenu} to={url}>{name}</Link>


    render () {

        return (

            <div style={{overflow: 'hidden', backgroundColor:'red'}}>

                <Menu isOpen={this.state.isOpen} onOpen={this.toggleMenu} onClose={this.toggleMenu}>
                    {this.login_logout_button()}
                    <br/>
                    <br/>
                    {this.getMenuLink('/', 'Examples')}
                    {isUserLoggedIn()?this.getMenuLink('/gallery', 'My Gallery'):''}
                    {isUserLoggedIn()?this.getMenuLink('/create', 'Generate'):''}
                </Menu>

            </div>
        );
    }
}

export default BurgerMenu