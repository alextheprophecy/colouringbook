import { bubble as Menu } from 'react-burger-menu';
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { isUserLoggedIn } from "../../Hooks/UserDataHandler";
import { handleLogout, switchAccount } from "../../Hooks/LoginHandler";
import { withTranslation } from 'react-i18next';
import LanguageChange from './language_change.component';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { setAskFeedback } from '../../redux/websiteSlice';
import { getUserData } from '../../Hooks/UserDataHandler';
import UserMenu from '../Auth/UserMenu';
const BurgerMenu = ({ t, isLoading, isEditing, setAskFeedback }) => {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();
    
    const toggleMenu = () => {
        setIsOpen(prev => !prev);
    }

    const closeMenu = () => {
        setIsOpen(false);
    }

    const handleFeedback = () => {
        setAskFeedback(true);
        closeMenu();
    }

    const isCreatePage = location.pathname === '/create';
    const shouldHideMenu = isLoading || (isEditing && isCreatePage);

    const getMenuLink = (url, name, customClass) => (
        <Link
            onClick={closeMenu}
            to={url}
            className={`flex items-center justify-center w-full px-4 py-3.5 rounded-lg text-lg font-medium transition-all duration-200 ${
                customClass || 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
        >
            {name}
        </Link>
    );

    const login_logout_button = () => (
        isUserLoggedIn() ?
            <div className="flex flex-col space-y-2 absolute bottom-4 left-0 w-fit">
                <div className="text-gray-400 text-sm text-center mb-1">
                    {getUserData().email}
                </div>
                <button 
                    className="w-full text-gray-700 bg-white hover:bg-gray-100 px-4 py-2.5 rounded-lg text-base font-medium transition-all duration-200 flex items-center justify-center border border-gray-200" 
                    onClick={() => switchAccount()}
                >
                    {t('login.switch-account')}
                    
                </button>
                <button 
                    className="w-full text-red-600 bg-transparent hover:bg-red-800 px-4 py-2.5 rounded-lg text-base font-medium transition-all duration-200 flex items-center justify-center border border-gray-700" 
                    onClick={() => handleLogout()}
                >
                    {t('login.logout')}
                </button>
            </div> :
            getMenuLink('/login', t('login.login'), 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200')
    );
    
    // Hide menu if editing or on create page
    if (shouldHideMenu) return null;
    
    return (
        <div className="fixed top-0 left-0 z-50">
            <Menu
                isOpen={isOpen}
                onOpen={toggleMenu}
                onClose={toggleMenu}
                burgerButtonClassName="fixed w-10 h-8 left-4 top-4 md:left-8 md:top-8 transition-all duration-200 hover:opacity-80"
                burgerBarClassName="bg-blue-500 rounded h-1 mx-auto my-0.5"
                crossButtonClassName="flex items-center justify-center w-8 h-8 hover:bg-gray-700 rounded-full cursor-pointer transition-all duration-200"
                crossClassName="bg-gray-400 w-5 h-0.5"
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
                        {getMenuLink('/', t('login.home'), 'bg-blue-600 hover:bg-blue-700 text-white')}                        
                        {isUserLoggedIn() && getMenuLink('/create', t('login.create'), 'bg-blue-600 hover:bg-blue-700 text-white')}
                        {isUserLoggedIn() && getMenuLink('/gallery', t('login.my-gallery'), 'bg-blue-600 hover:bg-blue-700 text-white')}
                        <div className="mt-auto">
                            {getMenuLink('/about', t('login.about'), 'text-gray-600 bg-transparent hover:bg-gray-800 border border-gray-700 text-white')}
                        </div>
                        {login_logout_button()}
                    </div>   
                </div>
            </Menu>
            
        </div>
    );
};

BurgerMenu.propTypes = {
    t: PropTypes.func.isRequired,
    setAskFeedback: PropTypes.func.isRequired,
    isEditing: PropTypes.bool.isRequired
};

const mapDispatchToProps = {
    setAskFeedback
};

const mapStateToProps = (state) => ({
    isLoading: state.book.isLoading,
    isEditing: state.book.isEditing
});

export default connect(
    mapStateToProps, 
    mapDispatchToProps
)(withTranslation()(BurgerMenu));