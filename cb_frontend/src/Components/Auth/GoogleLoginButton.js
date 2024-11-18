import React from 'react';

const GoogleLoginButton = () => {
    const handleGoogleLogin = () => {
        // In production, use process.env.REACT_APP_API_URL
        const baseUrl = process.env.NODE_ENV === 'production' 
            ? process.env.REACT_APP_API_URL 
            : 'http://localhost:5000';
            
        window.location.href = `${baseUrl}/api/user/auth/google`;
    };

    return (
        <button 
            onClick={handleGoogleLogin}
            className="flex items-center justify-center gap-2 w-full py-2 px-4 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
            <img 
                src="/google-icon.png" 
                alt="Google" 
                className="w-5 h-5"
            />
            Continue with Google
        </button>
    );
}; 

export default GoogleLoginButton;