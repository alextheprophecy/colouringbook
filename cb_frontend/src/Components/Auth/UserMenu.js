import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const UserMenu = ({ user }) => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            const baseUrl = process.env.NODE_ENV === 'production' 
                ? process.env.REACT_APP_API_URL 
                : 'http://localhost:5000';

            await fetch(`${baseUrl}/api/user/logout`, {
                method: 'POST',
                credentials: 'include'
            });

            // Clear local storage
            localStorage.removeItem('token');
            localStorage.removeItem('userData');

            // Clear Google OAuth session
            const googleLogoutUrl = "https://www.google.com/accounts/Logout";
            const popup = window.open(googleLogoutUrl, "_blank", "width=600,height=600");
            setTimeout(() => popup.close(), 2000);

            // Redirect to login
            navigate('/login');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const handleSwitchAccount = () => {
        // Clear local storage but keep cookies
        localStorage.removeItem('token');
        localStorage.removeItem('userData');
        
        // Redirect to Google login
        const baseUrl = process.env.NODE_ENV === 'production' 
            ? process.env.REACT_APP_API_URL 
            : 'http://localhost:5000';
        window.location.href = `${baseUrl}/api/user/auth/google`;
    };

    return (
        <div className="relative">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100"
            >
                <img 
                    src={user.picture || '/default-avatar.png'} 
                    alt="User" 
                    className="w-8 h-8 rounded-full"
                />
                <span className="text-sm font-medium">{user.full_name}</span>
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                    <div className="py-1" role="menu">
                        <button
                            onClick={handleSwitchAccount}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            role="menuitem"
                        >
                            Switch Account
                        </button>
                        <button
                            onClick={handleLogout}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            role="menuitem"
                        >
                            Sign Out
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserMenu; 