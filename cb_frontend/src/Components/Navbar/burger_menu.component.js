import { bubble as Menu } from 'react-burger-menu';
import { Component, React } from "react";
import { Link } from "react-router-dom";
import { isUserLoggedIn } from "../../Hooks/UserDataHandler";
import { handleLogout } from "../../Hooks/LoginHandler";
import { withTranslation } from 'react-i18next';
import LanguageChange from './language_change.component';
import PropTypes from 'prop-types';

class BurgerMenu extends Component {
 
    constructor(props) {
        super(props);
        this.state = { isOpen: false };
    }

    toggleMenu = () => {
        this.setState(prevState => ({ isOpen: !prevState.isOpen }));
    }

    closeMenu = () => {
        this.setState({ isOpen: false });
    }

    login_logout_button = () =>{
        const { t } = this.props;
        return isUserLoggedIn() ?
            <span className="text-white bg-red-600 hover:bg-red-700 px-3 py-2 absolute bottom-0 left-0 rounded text-lg font-bold cursor-pointer" onClick={() => handleLogout()}>{t('login.logout')}</span> :
            this.getMenuLink('/login', t('login.login'), 'bg-green-600 hover:bg-green-700');
}
    getMenuLink = (url, name, customClass) => (
        <Link
            onClick={this.closeMenu}
            to={url}
            className={`flex items-center justify-center px-3 py-2 rounded ${customClass || 'bg-blue-600 hover:bg-blue-700'} text-white font-bold text-lg shadow-md transition-transform transform hover:scale-105`}
        >
            {name}
        </Link>
    );

    render() {
        const { t } = this.props;
        return (
            <div className="fixed top-0 left-0 z-50">
                <Menu
                    isOpen={this.state.isOpen}
                    onOpen={this.toggleMenu}
                    onClose={this.toggleMenu}
                    burgerButtonClassName="fixed w-10 h-8 left-4 top-4 md:left-8 md:top-8 transition-all duration-200 hover:shadow-lg"
                    burgerBarClassName="bg-blue-500 rounded h-1 mx-auto my-0.5"
                    crossButtonClassName="flex items-center justify-center w-8 h-8 bg-red-500 rounded-full cursor-pointer"
                    crossClassName="bg-white w-5 h-0.5"
                    menuClassName="bg-gray-900 p-6 backdrop-blur-lg w-64"
                    morphShapeClassName="fill-gray-900 w-72"
                    overlayClassName="bg-gray-900 backdrop-blur-lg"
                    itemListClassName="flex flex-col text-white space-y-4"
                >
                    <div className="relative z-[60] mb-16">
                        <LanguageChange />
                    </div>
                    <div className="relative z-[50] flex flex-col space-y-4 h-full">
                        <div className="flex flex-col space-y-4">
                            {this.getMenuLink('/', t('login.home'))}
                            {isUserLoggedIn() ? this.getMenuLink('/create', t('login.create')) : ''}
                            {isUserLoggedIn() ? this.getMenuLink('/gallery', t('login.my-gallery')) : ''}
                            {this.login_logout_button()}
                        </div>   
                    </div>
                </Menu>
            </div>
        );
    }
}

BurgerMenu.propTypes = {
    t: PropTypes.func.isRequired
};

export default withTranslation()(BurgerMenu);