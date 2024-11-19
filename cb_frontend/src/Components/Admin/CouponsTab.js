import React from 'react';
import { format } from 'date-fns';
import PropTypes from 'prop-types';

const CouponsTab = ({ 
    adminFormData, 
    setAdminFormData, 
    handleAdminFormSubmit, 
    error, 
    success, 
    coupons, 
    fetchCoupons, 
    isLoadingCoupons 
}) => {
    return (
        <>
            {/* Create Coupon Form */}
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

            {/* Coupons List */}
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
};

CouponsTab.propTypes = {
    adminFormData: PropTypes.shape({
        credits: PropTypes.string.isRequired,
        expiresIn: PropTypes.string.isRequired,
        customCode: PropTypes.string.isRequired,
        useCustomCode: PropTypes.bool.isRequired
    }).isRequired,
    setAdminFormData: PropTypes.func.isRequired,
    handleAdminFormSubmit: PropTypes.func.isRequired,
    error: PropTypes.string.isRequired,
    success: PropTypes.string.isRequired,
    coupons: PropTypes.arrayOf(PropTypes.shape({
        code: PropTypes.string.isRequired,
        credits: PropTypes.number.isRequired,
        expiresAt: PropTypes.string.isRequired,
        isRedeemed: PropTypes.bool.isRequired,
        redeemedAt: PropTypes.string,
        redeemedBy: PropTypes.string
    })).isRequired,
    fetchCoupons: PropTypes.func.isRequired,
    isLoadingCoupons: PropTypes.bool.isRequired
};

export default CouponsTab; 