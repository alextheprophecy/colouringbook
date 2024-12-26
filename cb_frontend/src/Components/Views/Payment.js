import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import api from '../../Hooks/ApiHandler';

// Initialize Stripe with your publishable key
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

const PaymentContent = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

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
        <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                        Choose Your Plan
                    </h2>
                    <p className="mt-4 text-xl text-gray-600">
                        Select a credit package that suits your needs
                    </p>
                </div>

                <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {/* Basic Package */}
                    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                        <div className="px-6 py-8">
                            <h3 className="text-2xl font-bold text-gray-900">Basic Package</h3>
                            <p className="mt-4 text-gray-600">Perfect for getting started</p>
                            <p className="mt-8">
                                <span className="text-4xl font-extrabold text-gray-900">$9.99</span>
                            </p>
                            <ul className="mt-6 space-y-4">
                                <li className="flex items-center">
                                    <span className="text-green-500">✓</span>
                                    <span className="ml-3">10 Credits</span>
                                </li>
                            </ul>
                            <button
                                onClick={() => handlePayment('price_basic')}
                                disabled={loading}
                                className="mt-8 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors disabled:opacity-50"
                            >
                                {loading ? 'Processing...' : 'Get Started'}
                            </button>
                        </div>
                    </div>

                    {/* Premium Package */}
                    <div className="bg-white rounded-lg shadow-lg overflow-hidden border-2 border-blue-500">
                        <div className="px-6 py-8">
                            <h3 className="text-2xl font-bold text-gray-900">Premium Package</h3>
                            <p className="mt-4 text-gray-600">Most popular choice</p>
                            <p className="mt-8">
                                <span className="text-4xl font-extrabold text-gray-900">$24.99</span>
                            </p>
                            <ul className="mt-6 space-y-4">
                                <li className="flex items-center">
                                    <span className="text-green-500">✓</span>
                                    <span className="ml-3">30 Credits</span>
                                </li>
                                <li className="flex items-center">
                                    <span className="text-green-500">✓</span>
                                    <span className="ml-3">Priority Support</span>
                                </li>
                            </ul>
                            <button
                                onClick={() => handlePayment('price_premium')}
                                disabled={loading}
                                className="mt-8 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors disabled:opacity-50"
                            >
                                {loading ? 'Processing...' : 'Get Premium'}
                            </button>
                        </div>
                    </div>

                    {/* Pro Package */}
                    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                        <div className="px-6 py-8">
                            <h3 className="text-2xl font-bold text-gray-900">Pro Package</h3>
                            <p className="mt-4 text-gray-600">For power users</p>
                            <p className="mt-8">
                                <span className="text-4xl font-extrabold text-gray-900">$49.99</span>
                            </p>
                            <ul className="mt-6 space-y-4">
                                <li className="flex items-center">
                                    <span className="text-green-500">✓</span>
                                    <span className="ml-3">75 Credits</span>
                                </li>
                                <li className="flex items-center">
                                    <span className="text-green-500">✓</span>
                                    <span className="ml-3">Priority Support</span>
                                </li>
                                <li className="flex items-center">
                                    <span className="text-green-500">✓</span>
                                    <span className="ml-3">Advanced Features</span>
                                </li>
                            </ul>
                            <button
                                onClick={() => handlePayment('price_pro')}
                                disabled={loading}
                                className="mt-8 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors disabled:opacity-50"
                            >
                                {loading ? 'Processing...' : 'Go Pro'}
                            </button>
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="mt-8 text-center text-red-600">
                        {error}
                    </div>
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
