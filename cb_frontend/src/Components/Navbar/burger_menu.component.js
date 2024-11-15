import { bubble as Menu } from 'react-burger-menu';
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { isUserLoggedIn } from "../../Hooks/UserDataHandler";
import { handleLogout } from "../../Hooks/LoginHandler";
import { withTranslation } from 'react-i18next';
import LanguageChange from './language_change.component';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { setAskFeedback } from '../../redux/websiteSlice';
import { MessageSquare } from 'lucide-react';

const BurgerMenu = ({ t, isEditing, setAskFeedback }) => {
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
    const shouldHideMenu = isEditing && isCreatePage;

    const getMenuLink = (url, name, customClass) => (
        <Link
            onClick={closeMenu}
            to={url}
            className={`flex items-center justify-center px-3 py-2 rounded ${customClass || 'bg-blue-600 hover:bg-blue-700'} text-white font-bold text-lg shadow-md transition-transform transform hover:scale-105`}
        >
            {name}
        </Link>
    );

    const login_logout_button = () => (
        isUserLoggedIn() ?
            <span 
                className="text-white bg-red-600 hover:bg-red-700 px-3 py-2 absolute bottom-0 left-0 rounded text-lg font-bold cursor-pointer" 
                onClick={() => handleLogout()}
            >
                {t('login.logout')}
            </span> :
            getMenuLink('/login', t('login.login'), 'bg-green-600 hover:bg-green-700')
    );
    
    // Hide menu if editing or on create page
    if (shouldHideMenu) return null;
    
    return (
        <div className="fixed top-0 left-0 z-50">
            <Menu
                isOpen={isOpen}
                onOpen={toggleMenu}
                onClose={toggleMenu}
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
                        {getMenuLink('/', t('login.home'))}
                        {getMenuLink('/demo', t('login.demo'), 'bg-purple-600 hover:bg-purple-700')}
                        {isUserLoggedIn() && getMenuLink('/create', t('login.create'))}
                        {isUserLoggedIn() && getMenuLink('/gallery', t('login.my-gallery'))}
                        {isUserLoggedIn() && (
                            <button
                                onClick={handleFeedback}
                                className="flex items-center justify-center gap-2 px-3 py-2 rounded 
                                    bg-green-600/70 hover:bg-green-700/70 text-white font-bold text-lg 
                                    shadow-md transition-transform transform hover:scale-105"
                            >
                                <MessageSquare className="w-5 h-5" />
                                {t('feedback.give-feedback')}
                            </button>
                        )}
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
    isEditing: state.book.isEditing
});

export default connect(
    mapStateToProps, 
    mapDispatchToProps
)(withTranslation()(BurgerMenu));