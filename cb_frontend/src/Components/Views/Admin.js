import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../../Hooks/ApiHandler';
import { format } from 'date-fns';
import { 
    TicketIcon, 
    ChatBubbleLeftRightIcon, 
    UsersIcon, 
    BookOpenIcon 
} from '@heroicons/react/24/outline';

const Admin = () => {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState('coupons');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [adminFormData, setAdminFormData] = useState({
        credits: '',
        expiresIn: '30',
        customCode: '',
        useCustomCode: false
    });
    const [coupons, setCoupons] = useState([]);
    const [isLoadingCoupons, setIsLoadingCoupons] = useState(false);

    const tabs = [
        { id: 'coupons', name: 'Coupons', icon: TicketIcon },
        { id: 'feedback', name: 'Feedback', icon: ChatBubbleLeftRightIcon },
        { id: 'users', name: 'Users', icon: UsersIcon },
        { id: 'books', name: 'Books', icon: BookOpenIcon },
    ];

    const handleAdminFormSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const response = await api.post('/user/coupons/create', {
                adminFormData: {
                    ...adminFormData,
                    code: adminFormData.useCustomCode ? adminFormData.customCode : undefined
                }
            });

            if (response && response.data) {
                setSuccess(`Coupon created successfully: ${response.data.coupon.code}`);
                setAdminFormData({
                    credits: '',
                    expiresIn: '30',
                    customCode: '',
                    useCustomCode: false
                });
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create coupon');
        }
    };

    const fetchCoupons = async () => {
        setIsLoadingCoupons(true);
        try {
            const response = await api.get('/user/coupons/list');
            setCoupons(response.data.coupons);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch coupons');
        } finally {
            setIsLoadingCoupons(false);
        }
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'coupons':
                return renderCouponsContent();
            case 'feedback':
                return <div className="text-center py-8">Feedback management coming soon</div>;
            case 'users':
                return <div className="text-center py-8">User management coming soon</div>;
            case 'books':
                return <div className="text-center py-8">Book management coming soon</div>;
            default:
                return null;
        }
    };

    const renderCouponsContent = () => (
        <>
            <div className="bg-white rounded-xl shadow-md overflow-hidden p-6 mb-6">
                <div className="text-center mb-6">
                    <h3 className="text-xl font-semibold text-gray-900">Create Coupon</h3>
                </div>

                <form onSubmit={handleAdminFormSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="credits" className="block text-sm font-medium text-gray-700">
                            Credits Amount
                        </label>
                        <input
                            type="number"
                            id="credits"
                            value={adminFormData.credits}
                            onChange={(e) => setAdminFormData({
                                ...adminFormData,
                                credits: e.target.value
                            })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                            required
                            min="1"
                        />
                    </div>

                    <div>
                        <label htmlFor="expiresIn" className="block text-sm font-medium text-gray-700">
                            Expires In (days)
                        </label>
                        <input
                            type="number"
                            id="expiresIn"
                            value={adminFormData.expiresIn}
                            onChange={(e) => setAdminFormData({
                                ...adminFormData,
                                expiresIn: e.target.value
                            })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                            required
                            min="1"
                        />
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="useCustomCode"
                                checked={adminFormData.useCustomCode}
                                onChange={(e) => setAdminFormData({
                                    ...adminFormData,
                                    useCustomCode: e.target.checked,
                                    customCode: ''
                                })}
                                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                            />
                            <label htmlFor="useCustomCode" className="ml-2 block text-sm text-gray-700">
                                Use Custom Coupon Code
                            </label>
                        </div>

                        {adminFormData.useCustomCode && (
                            <div>
                                <label htmlFor="customCode" className="block text-sm font-medium text-gray-700">
                                    Custom Code (12 characters)
                                </label>
                                <input
                                    type="text"
                                    id="customCode"
                                    value={adminFormData.customCode}
                                    onChange={(e) => {
                                        const value = e.target.value.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
                                        setAdminFormData({
                                            ...adminFormData,
                                            customCode: value.slice(0, 12)
                                        });
                                    }}
                                    placeholder="XXXXXXXXXXXX"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 uppercase"
                                    required={adminFormData.useCustomCode}
                                    maxLength="12"
                                    pattern="[A-Z0-9]{12}"
                                    title="12 characters (letters and numbers only)"
                                />
                                <p className="mt-1 text-sm text-gray-500">
                                    {adminFormData.customCode.length}/12 characters
                                </p>
                            </div>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={adminFormData.useCustomCode && adminFormData.customCode.length !== 12}
                        className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
                            ${(adminFormData.useCustomCode && adminFormData.customCode.length !== 12)
                                ? 'bg-purple-300 cursor-not-allowed'
                                : 'bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500'
                            }`}
                    >
                        Create Coupon
                    </button>
                </form>

                {error && (
                    <div className="text-red-500 text-sm text-center mt-4">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="text-green-500 text-sm text-center mt-4">
                        {success}
                    </div>
                )}
            </div>

            <div className="bg-white rounded-xl shadow-md overflow-hidden p-6">
                <div className="text-center mb-6">
                    <h3 className="text-xl font-semibold text-gray-900">Coupons List</h3>
                </div>
                
                <button
                    onClick={fetchCoupons}
                    disabled={isLoadingCoupons}
                    className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
                        ${isLoadingCoupons
                            ? 'bg-purple-300 cursor-not-allowed'
                            : 'bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500'
                        }`}
                >
                    {isLoadingCoupons ? 'Loading...' : 'Fetch Coupons'}
                </button>

                <div className="mt-6 space-y-4">
                    {coupons.map((coupon) => (
                        <div key={coupon.code} className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start">
                                <div className="font-mono text-lg font-bold text-purple-600">{coupon.code}</div>
                                <div className={`text-sm px-2 py-1 rounded ${
                                    coupon.isRedeemed ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                                }`}>
                                    {coupon.isRedeemed ? 'Redeemed' : 'Available'}
                                </div>
                            </div>
                            <div className="mt-2 text-sm text-gray-600">
                                <div>Credits: {coupon.credits}</div>
                                <div>Expires: {format(new Date(coupon.expiresAt), 'PPp')}</div>
                                {coupon.isRedeemed && (
                                    <>
                                        <div className="mt-1 text-red-600">
                                        Redeemed at: {format(new Date(coupon.redeemedAt), 'PPp')}
                                        </div>
                                        <div className="mt-1 text-red-600">
                                            Redeemed by: <strong>{coupon.redeemedBy}</strong>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="py-6">
                        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                    </div>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="border-b border-gray-200">
                    <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                        {tabs.map((tab) => {
                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`
                                        group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm
                                        ${isActive 
                                            ? 'border-purple-500 text-purple-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        }
                                    `}
                                >
                                    <tab.icon 
                                        className={`
                                            -ml-0.5 mr-2 h-5 w-5
                                            ${isActive ? 'text-purple-500' : 'text-gray-400 group-hover:text-gray-500'}
                                        `}
                                        aria-hidden="true" 
                                    />
                                    <span>{tab.name}</span>
                                </button>
                            );
                        })}
                    </nav>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {renderContent()}
            </div>
        </div>
    );
};

export default Admin;
