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
import { LogOut, LogIn, Home, Info, SwitchCamera, BookCopy, BookPlus, UserCircle, Shield } from 'lucide-react';
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

    const getMenuLink = (url, name, customClass, icon) => {
        const isActive = location.pathname === url;
        const baseClasses = "flex items-center justify-start w-full px-4 py-3 rounded-lg text-lg font-medium transition-all duration-200";
        
        // Add a left border and slightly darker background for active items
        const activeClasses = isActive ? "border-l-4 border-2 -ml-[2px] border-blue-500" : "";
        
        // Modify the background colors for active state
        let finalCustomClass = customClass;
        if (isActive) {
            if (customClass.includes('bg-blue-200')) {
                finalCustomClass = customClass.replace('bg-blue-200', 'bg-blue-300');
            } else if (customClass.includes('bg-green-200')) {
                finalCustomClass = customClass.replace('bg-green-200', 'bg-green-300');
            } else if (customClass.includes('bg-purple-200')) {
                finalCustomClass = customClass.replace('bg-purple-200', 'bg-purple-300');
            }
        }

        return (
            <Link
                onClick={closeMenu}
                to={url}
                className={`${baseClasses} ${activeClasses} ${finalCustomClass}`}
            >
                {icon && <span className="mr-2">{icon}</span>}
                {name}
            </Link>
        );
    };

    const login_logout_button = () => (        
            <div className="flex flex-col space-y-2 absolute bottom-4 left-0 w-full">
                {isUserLoggedIn() ?
                    <>
                        <div className="text-gray-400 text-sm text-center mb-1">
                            {getUserData().email}
                        </div>
                        <button 
                            className="w-full text-gray-700 h-12 bg-white hover:bg-gray-100 px-4 py-2.5 rounded-lg text-sm md:text-base font-medium transition-all duration-200 flex items-center justify-center border border-gray-200" 
                            onClick={() => switchAccount()}
                        >
                            <SwitchCamera className="w-5 h-5 mr-2" />
                            {t('login.switch-account')}
                        </button>
                        <button 
                            className="w-full text-red-600 bg-transparent hover:bg-red-800 px-4 py-2.5 rounded-lg text-sm md:text-base  font-medium transition-all duration-200 flex items-center justify-center border border-gray-700" 
                            onClick={() => handleLogout()}
                        >
                            <LogOut className="w-5 h-5 mr-2" />
                            {t('login.logout')}
                        </button>
                    </> :
                getMenuLink('/login', t('login.login'), 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200', <LogIn className="w-5 h-5" />)}
            </div>
    );
    
    const TopNavIcons = (className) => (
        <div className={`absolute top-2 md:top-2 flex items-center space-x-4 z-50 ${className}`}>
            <LanguageChange />
            
            
            <button
                onClick={() => window.location.href = '/about'}
                className={`flex items-center justify-center w-10 h-10 rounded-full bg-blue-600/20 hover:bg-blue-600/30 transition-all duration-200 
                    ${location.pathname === '/about' ? 'border-2 border-blue-500 bg-blue-600/60' : ''}`}
            >
                <Info className="w-5 h-5 text-blue-500" />
            </button>
        </div>
    );

    // Hide menu if editing or on create page
    if (shouldHideMenu) return null// <TopNavIcons className="z-50" />;
    
    return (
        <>           
            <div className="fixed top-0 left-0 z-50">
                <Menu
                    isOpen={isOpen}
                    onOpen={toggleMenu}
                    onClose={toggleMenu}
                    burgerButtonClassName="fixed w-10 h-8 left-4 top-4 md:left-8 md:top-8 transition-colors duration-200 hover:opacity-80"
                    burgerBarClassName="bg-blue-500 rounded-sm h-0.5 mx-auto my-1"
                    crossButtonClassName="flex items-center justify-center w-8 h-8 hover:bg-gray-100 rounded-full cursor-pointer transition-colors duration-200"
                    crossClassName="bg-gray-500"
                    menuClassName="bg-white p-6 w-64"
                    morphShapeClassName="fill-white"
                    overlayClassName="bg-gray-800/50 backdrop-blur-sm"
                    itemListClassName="flex flex-col space-y-2"
                    
                >
                    <div className="relative z-[50] flex flex-col space-y-4 h-full">
                        <div className="relative z-[60] mb-16">
                            <TopNavIcons />
                        </div>
                        <div className="flex flex-col space-y-4">
                            {getMenuLink('/', t('login.home'), 'bg-blue-200 hover:bg-blue-300 text-blue-700', <Home className="w-5 h-5" />)}
                            {isUserLoggedIn() && getMenuLink('/profile', t('login.profile'), 'bg-blue-200 hover:bg-blue-300 text-blue-700', <UserCircle className="w-5 h-5" />)}
                                
                            <div className="h-1 bg-gray-200"></div>
                            {isUserLoggedIn() && getMenuLink('/gallery', t('login.my-gallery'), 'bg-blue-200 hover:bg-blue-300 text-blue-700', <BookCopy className="w-5 h-5" />)}
                            {isUserLoggedIn() && getMenuLink('/create', t('login.create'), 'bg-blue-200 hover:bg-blue-300 text-blue-700', <BookPlus className="w-5 h-5" />)}
                            {isUserLoggedIn() && getUserData().isAdmin && (
                                <>
                                    <div className="h-1 bg-gray-200"></div>
                                    {getMenuLink('/admin', t('login.admin'), 'bg-purple-200 hover:bg-purple-300 text-purple-700', <Shield className="w-5 h-5" />)}
                                </>
                            )}
                                   {login_logout_button()}         
                        </div>
                    </div>
                      
                </Menu>
            </div>
        </>
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