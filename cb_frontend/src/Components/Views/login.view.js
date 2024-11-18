import React from "react";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { handleLogin } from "../../Hooks/LoginHandler";
import { isUserLoggedIn } from "../../Hooks/UserDataHandler";
import LogoutComponent from "../Navbar/logout.component";
import { Mail, Lock, ChevronDown } from 'lucide-react';
import ScribbleText from "../UI/ui_scribble_text.component";
import GoogleLoginButton from "../Auth/GoogleLoginButton";
const LoginView = () => {
    const { t } = useTranslation();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showDevLogin, setShowDevLogin] = useState(false);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onLogin = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        await handleLogin(formData);
        setIsSubmitting(false);
    };

    const loginHTML = () => (
        <div className="min-h-screen flex items-center justify-center bg-paper relative">
            {/* Paper texture overlay with gradient */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-blue-50/50 to-blue-300/50" />
                <div className="w-full max-w-md mx-4 p-8 bg-white/95 backdrop-blur-sm rounded-lg shadow-xl relative">
                    
                    
                    <div className="mb-8 flex justify-center">
                        <ScribbleText
                            text={t('login.welcome')}
                            sizeFactor={0.6}
                            fillColor="#027a9f"
                            strokeColor="#00a4d7"
                            roughness={1.25}
                            strokeWidth={2}
                            animate={true}
                        />
                    </div>
                    
                    <GoogleLoginButton/>
                    
                    <div className="mt-6  bg-blue-200/50 p-2 rounded-lg">
                        <button
                            type="button"
                            onClick={() => setShowDevLogin(!showDevLogin)}
                            className="w-full py-2 px-4 flex items-center justify-between text-gray-600 hover:text-gray-800 transition-colors font-children duration-200"
                        >
                            <span>Dev Sign In</span>
                            <ChevronDown className={`w-5 h-5 transform transition-transform duration-200 ${showDevLogin ? 'rotate-180' : ''}`} />
                        </button>
                        
                        {showDevLogin && (
                            <form onSubmit={onLogin} className="mt-4 space-y-6">
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder={t('login.email')}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 font-children bg-white"
                                        required
                                    />
                                </div>

                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="password"
                                        name="password"
                                        placeholder={t('login.password')}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 font-children bg-white"
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed font-children font-semibold tracking-wide flex items-center justify-center gap-2"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            <span>{t('login.logging-in')}</span>
                                        </>
                                    ) : (
                                        <span>{t('login.login')}</span>
                                    )}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
        </div>
    );

    return isUserLoggedIn() ? <LogoutComponent /> : loginHTML();
};

export default LoginView;