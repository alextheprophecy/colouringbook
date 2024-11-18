import React from 'react';
import GoogleButton from 'react-google-button'

const GoogleLoginButton = () => {
    const handleGoogleLogin = () => {
        // In production, use process.env.REACT_APP_API_URL
        const baseUrl = process.env.NODE_ENV === 'production' 
            ? process.env.REACT_APP_API_URL 
            : 'http://localhost:5000';
            
        window.location.href = `${baseUrl}/api/user/auth/google`;
    };

    return <div className="flex w-full justify-center mb-4"><GoogleButton onClick={handleGoogleLogin} /></div>       
}; 

export default GoogleLoginButton;