import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import api from '../../Hooks/ApiHandler';
import ScribbleText from '../UI/ui_scribble_text.component';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, Star, ChevronDown, Info, Gift } from 'lucide-react';

// Initialize Stripe with your publishable key
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

const FeatureItem = ({ children, isCredit = false, bonusAmount = 0 }) => (
    <li className="flex items-center gap-3">
        <Star className={`flex-shrink-0 ${isCredit ? 'w-6 h-6 text-yellow-500' : 'w-5 h-5 text-yellow-500'}`} />
        <div className={`font-children ${isCredit ? 'text-2xl font-bold text-blue-600' : 'text-lg font-semibold text-gray-700'}`}>
            {isCredit ? (
                <span>
                    {children}
                    {bonusAmount > 0 && (
                        <span className="text-yellow-600 text-xl ml-1">+{bonusAmount} </span>
                    )}
                    Credits
                </span>
            ) : children}
        </div>
    </li>
);

const BonusSticker = ({ amount }) => (
    <div className="absolute -right-10 top-4 bg-yellow-400 text-blue-800 font-children font-bold py-2 px-12 shadow-lg transform rotate-12 z-10 flex items-center gap-2">
        <Gift className="w-5 h-5" />
        +{amount} Credits gifted
    </div>
);

const PaymentContent = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isExplanationOpen, setIsExplanationOpen] = useState(false);

    const handlePayment = async (priceId) => {
        try {
            setLoading(true);
            setError(null);

            const { data } = await api.post('/user/create-checkout-session', {
                priceId: priceId,
            });
            
            if (data.url) {
                window.location.href = data.url;
            } else {
                setError('Could not initiate checkout. Please try again.');
            }
        } catch (err) {
            setError(err.response?.data?.error || 'An error occurred. Please try again later.');
            console.error('Payment error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100/50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <div className="flex justify-center mb-2">
                        <ScribbleText
                            text="Buy Credits"
                            sizeFactor={0.7}
                            fillColor="#027a9f"
                            strokeColor="#00a4d7"
                            roughness={0.6}
                            strokeWidth={1.5}
                            animate={true}
                        />
                    </div>
                    <button 
                        onClick={() => setIsExplanationOpen(!isExplanationOpen)}
                        className="text-gray-600 font-children text-lg font-bold hover:text-blue-600 transition-colors flex items-center gap-2 mx-auto bg-white px-2 py-1 rounded-lg"
                    >
                        <Info className="w-5 h-5" />
                        What is a credit?
                        <ChevronDown 
                            className={`w-5 h-5 transition-transform duration-200 ${isExplanationOpen ? 'rotate-180' : ''}`}
                        />
                    </button>
                    <AnimatePresence>
                        {isExplanationOpen && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.2 }}
                                className="overflow-hidden"
                            >
                                <div className="mt-4 bg-white/80 backdrop-blur-sm rounded-lg p-4 max-w-lg mx-auto font-children shadow-sm">
                                    <h4 className="text-gray-600 font-bold text-xl mb-4">Generate colouring pages with credits</h4>
                                    <div className="grid grid-cols-3 gap-4 text-center">
                                        <div>
                                            <div className="text-gray-600">Basic quality</div>
                                            <div className="text-2xl font-bold text-blue-600">1 credit</div>
                                        </div>
                                        <div>
                                            <div className="text-gray-600">Advanced quality</div>
                                            <div className="text-2xl font-bold text-blue-600">3 credits</div>
                                        </div>
                                        <div>
                                            <div className="text-gray-600">Excellent quality</div>
                                            <div className="text-2xl font-bold text-blue-600">5 credits</div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {/* Basic Package */}
                    <motion.div 
                        className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-visible relative group flex flex-col"
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"/>
                        <div className="px-6 py-8 relative flex-grow flex flex-col">
                            <div>
                                <h3 className="text-2xl font-bold text-gray-900 font-children mb-16">Basic Package</h3>
                                <p className="text-gray-600 font-children text-lg mb-6"></p>
                                <p className="mb-8 flex items-baseline">
                                    <span className="text-5xl font-extrabold text-blue-600 font-children">€5</span>
                                </p>
                                <ul className="space-y-4">
                                    <FeatureItem isCredit>200 </FeatureItem>
                                    <FeatureItem>Access to all AI models</FeatureItem>
                                </ul>
                            </div>
                            <div className="mt-auto pt-8">
                                <button
                                    onClick={() => handlePayment('price_basic')}
                                    disabled={loading}
                                    className="w-full border-b-4 bg-blue-500 border-blue-600 hover:bg-blue-600 text-white font-children text-lg py-3 px-4 rounded-lg transition-colors duration-300 disabled:opacity-50 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                                >
                                    <CreditCard className="w-5 h-5" />
                                    {loading ? 'Processing...' : 'Buy Credits'}
                                </button>
                                <p className="text-center text-gray-500 font-children text-sm mt-3">Pay once, no subscription required</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Standard Package */}
                    <motion.div 
                        className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-visible relative group transform scale-105 border-2 border-blue-400 flex flex-col"
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <BonusSticker amount={50} />
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"/>
                        <div className="px-6 py-8 relative flex-grow flex flex-col">
                            <div>
                                <h3 className="text-2xl font-bold text-gray-900 font-children mb-16">Standard Package</h3>
                                <p className="text-gray-600 font-children text-lg mb-6"></p>
                                <p className="mb-8 flex items-baseline">
                                    <span className="text-5xl font-extrabold text-blue-600 font-children">€10</span>
                                </p>
                                <ul className="space-y-4">
                                    <FeatureItem isCredit bonusAmount={50}>500</FeatureItem>
                                    <FeatureItem>Access to all AI models</FeatureItem>
                                    <FeatureItem>Standard Support</FeatureItem>
                                </ul>
                            </div>
                            <div className="mt-auto pt-8">
                                <button
                                    onClick={() => handlePayment('price_standard')}
                                    disabled={loading}
                                    className="w-full bg-blue-500 border-b-4 border-blue-600 hover:bg-blue-600 text-white font-children text-lg py-3 px-4 rounded-lg transition-colors duration-300 disabled:opacity-50 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                                >
                                    <CreditCard className="w-5 h-5" />
                                    {loading ? 'Processing...' : 'Buy Credits'}
                                    </button>
                                    <p className="text-center text-gray-500 font-children text-sm mt-3">Pay once, no subscription required</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Pro Package */}
                    <motion.div 
                        className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-visible relative group flex flex-col"
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                    >
                        <BonusSticker amount={150} />
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"/>
                        <div className="px-6 py-8 relative flex-grow flex flex-col">
                            <div>
                                <h3 className="text-2xl font-bold text-gray-900 font-children mb-16">Pro Package</h3>
                                <p className="text-gray-600 font-children text-lg mb-6"></p>
                                <p className="mb-8 flex items-baseline">
                                    <span className="text-5xl font-extrabold text-blue-600 font-children">€25</span>
                                </p>
                                <ul className="space-y-4">
                                    <FeatureItem isCredit bonusAmount={150}>1500</FeatureItem>
                                    <FeatureItem>Access to all AI models</FeatureItem>
                                    <FeatureItem>Priority Support</FeatureItem>
                                    <FeatureItem>Get your best drawings on the homepage!</FeatureItem>
                                </ul>
                            </div>
                            <div className="mt-auto pt-8">
                                <button
                                    onClick={() => handlePayment('price_pro')}
                                    disabled={loading}
                                    className="w-full bg-blue-500 border-b-4 border-blue-600 hover:bg-blue-600 text-white font-children text-lg py-3 px-4 rounded-lg transition-colors duration-300 disabled:opacity-50 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                                >
                                    <CreditCard className="w-5 h-5" />
                                    {loading ? 'Processing...' : 'Buy Credits'}
                                </button>
                                <p className="text-center text-gray-500 font-children text-sm mt-3">Pay once, no subscription required</p>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {error && (
                    <motion.div 
                        className="mt-8 text-center text-red-600 font-children text-lg"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        {error}
                    </motion.div>
                )}
            </div>
        </div>
    );
};

// Wrap the entire component with Stripe Elements
const Payment = () => {
    return (
        <Elements stripe={stripePromise}>
            <PaymentContent />
        </Elements>
    );
};

export default Payment;
