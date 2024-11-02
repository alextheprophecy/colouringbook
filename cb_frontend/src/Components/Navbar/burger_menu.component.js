import { bubble as Menu } from 'react-burger-menu';
import { Component } from "react";
import { Link } from "react-router-dom";
import { isUserLoggedIn } from "../../Hooks/UserDataHandler";
import { handleLogout } from "../../Hooks/LoginHandler";
import { withTranslation } from 'react-i18next';
import LanguageChange from './language_change.component';

const locales = {
    en_gb: { title: 'English' },
    fr: { title: 'Francais' },
    de: { title: 'Deutsch' },
    it: { title: 'Italiano' },
    es: { title: 'Español' },
};

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
            <span className="text-white bg-red-600 px-2 py-1 rounded absolute bottom-8 left-4 text-sm" onClick={() => handleLogout()}>{t('login.logout')}</span> :
            this.getMenuLink('/login', t('login.login'));
}
    getMenuLink = (url, name) => (
        <Link
            onClick={this.closeMenu}
            to={url}
            className="flex items-center justify-center px-3 py-2 mb-3 rounded bg-blue-600 text-white font-bold text-lg shadow-md transition-transform transform hover:scale-105 hover:bg-blue-700"
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
                    burgerButtonClassName="fixed w-10 h-10 left-6 top-6 transition-all duration-200 hover:shadow-lg"
                    burgerBarClassName="bg-blue-500 rounded h-1 mx-auto my-0.5"
                    crossButtonClassName="flex items-center justify-center w-8 h-8 bg-red-500 rounded-full cursor-pointer"
                    crossClassName="bg-white w-5 h-0.5"
                    menuClassName="bg-gray-900 p-6 backdrop-blur-lg w-64"
                    morphShapeClassName="fill-gray-900 w-72"
                    overlayClassName="bg-gray-900 backdrop-blur-lg"
                    itemListClassName="text-white space-y-4"
                >
                    <LanguageChange />
                    {this.getMenuLink('/', t('login.home'))}
                    {isUserLoggedIn() ? this.getMenuLink('/create', t('login.create')) : ''}
                    {isUserLoggedIn() ? this.getMenuLink('/gallery', t('login.my-gallery')) : ''}
                    {this.login_logout_button()}
                </Menu>
            </div>
        );
    }
}

export default withTranslation()(BurgerMenu);