import React, { useState, useRef } from 'react';
import { getUserData } from '../../Hooks/UserDataHandler';
import { User, Mail, Coins, Gift } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import ReCAPTCHA from 'react-google-recaptcha';
import api from '../../Hooks/ApiHandler';
import { useDispatch, useSelector } from 'react-redux';
import { updateCredits } from '../../redux/websiteSlice';

const Profile = () => {
    const userData = getUserData();
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const [couponCode, setCouponCode] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [redeemAnimation, setRedeemAnimation] = useState(null);
    const recaptchaRef = useRef(null);
    const [captchaValue, setCaptchaValue] = useState(null);
    const [adminFormData, setAdminFormData] = useState({
        credits: '',
        expiresIn: '30',
        customCode: '',
        useCustomCode: false
    });

    const {credits} = useSelector(state => state.website);

    // Format coupon code while typing (XXXX-XXXX-XXXX)
    const handleCouponChange = (e) => {
        const value = e.target.value.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
        let formattedValue = value;
        if (value.length > 4) {
            formattedValue = value.slice(0, 4) + '-' + value.slice(4);
        }
        if (value.length > 8) {
            formattedValue = formattedValue.slice(0, 9) + '-' + formattedValue.slice(9);
        }
        setCouponCode(formattedValue.slice(0, 14)); // 12 chars + 2 hyphens
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setRedeemAnimation(null);

        if (!captchaValue) {
            setError(t('profile.pleaseVerifyCaptcha'));
            return;
        }

        setIsSubmitting(true);
        
        try {
            const response = await api.post('/user/coupons/redeem', {                
                couponCode: couponCode.replace(/-/g, ''),
                recaptchaToken: captchaValue
            });

            const { creditsAdded, newTotal } = response.data;

            // Update redux store with new credits
            dispatch(updateCredits(newTotal));

            // Show animation and success message
            setRedeemAnimation({
                creditsAdded,
                newTotal
            });
            
            setSuccess(t('profile.couponRedeemed', { 
                creditsAdded,
                newTotal
            }));
            
            setCouponCode('');
            setCaptchaValue(null);
            recaptchaRef.current?.reset();
        } catch (err) {
            setError(err.response?.data?.message || t('profile.redemptionError'));
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCaptchaChange = (value) => {
        setCaptchaValue(value);
    };


    if (!userData) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-gray-600">No user data available</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            {/* Account Information Container */}
            <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-6 mb-8">
                <div className="text-center mb-8">
                    <div className="h-24 w-24 rounded-full bg-blue-100 mx-auto flex items-center justify-center">
                        <User className="h-12 w-12 text-blue-600" />
                    </div>
                    <h2 className="mt-4 text-2xl font-bold text-gray-900">{userData.name}</h2>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                        <User className="h-6 w-6 text-blue-600 mr-3" />
                        <div>
                            <div className="text-sm text-gray-500">{t('profile.name')}</div>
                            <div className="text-gray-900">{userData.full_name}</div>
                        </div>
                    </div>
                    <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                        <Mail className="h-6 w-6 text-blue-600 mr-3" />
                        <div>
                            <div className="text-sm text-gray-500">{t('profile.email')}</div>
                            <div className="text-gray-900">{userData.email}</div>
                        </div>
                    </div>

                    <div className={`flex items-center p-4 ${credits === 0 ? 'bg-red-50' : 'bg-gray-50'} rounded-lg relative overflow-hidden`}>
                        <Coins className="h-6 w-6 text-blue-600 mr-3" />
                        <div>
                            <div className="text-sm text-gray-500">{t('profile.credits')}</div>
                            <div className="text-gray-900">
                                {credits}
                                {redeemAnimation && (
                                    <span className="ml-2 text-green-500 animate-fade-up">
                                        +{redeemAnimation.creditsAdded}
                                    </span>
                                )}
                            </div>
                        </div>
                        {redeemAnimation && (
                            <div className="absolute inset-0 bg-green-100 opacity-20 animate-pulse" />
                        )}
                    </div>
                </div>
            </div>

            {/* Coupon Redemption Container */}
            <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-6">
                <div className="text-center mb-6">
                    <div className="h-12 w-12 rounded-full bg-purple-100 mx-auto flex items-center justify-center mb-4">
                        <Gift className="h-6 w-6 text-purple-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">{t('profile.redeemCoupon')}</h3>
                    <p className="mt-2 text-sm text-gray-500">{t('profile.enterCouponDesc')}</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex justify-center">
                        <input
                            type="text"
                            id="coupon"
                            value={couponCode}
                            onChange={handleCouponChange}
                            placeholder="XXXX-XXXX-XXXX"
                            className="w-[302px] px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-center uppercase tracking-wider font-mono text-lg"
                            maxLength="14"
                        />
                    </div>

                    <div className="flex justify-center">
                        <ReCAPTCHA
                            ref={recaptchaRef}
                            sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY}
                            onChange={handleCaptchaChange}
                        />
                    </div>

                    {error && (
                        <div className="text-red-500 text-sm text-center mt-4 animate-fade-in">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="text-green-500 text-sm text-center mt-4 animate-fade-in">
                            {success}
                        </div>
                    )}

                    <div className="flex justify-center">
                        <button
                            type="submit"
                            disabled={couponCode.replace(/-/g, '').length !== 12 || !captchaValue || isSubmitting}
                            className={`w-[302px] flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
                                ${isSubmitting || couponCode.replace(/-/g, '').length !== 12 || !captchaValue
                                ? 'bg-purple-300 cursor-not-allowed'
                                : 'bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500'
                            }`}
                        >
                            {isSubmitting ? (
                                <div className="flex items-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    {t('profile.processing')}
                                </div>
                            ) : t('profile.redeemButton')}
                        </button>
                    </div>
                </form>
            </div>
            
        </div>
    );
};

export default Profile;
