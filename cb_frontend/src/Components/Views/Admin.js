import React, { useState, useEffect } from 'react';
import { 
    TicketIcon, 
    ChatBubbleLeftRightIcon, 
    UsersIcon, 
    BookOpenIcon 
} from '@heroicons/react/24/outline';
import { saveAdminBooks, getAdminBooks } from '../../Hooks/UserDataHandler';
import BooksTab from '../Admin/BooksTab';
import CouponsTab from '../Admin/CouponsTab';
import UsersTab from '../Admin/UsersTab';
import api from '../../Hooks/ApiHandler';
import FeedbacksTab from '../Admin/FeedbacksTab';

const Admin = () => {
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
    const [books, setBooks] = useState([]);
    const [isLoadingBooks, setIsLoadingBooks] = useState(false);
    const [timeRange, setTimeRange] = useState('day');
    const [selectedBooks, setSelectedBooks] = useState([]);
    const [loadingPDF, setLoadingPDF] = useState({});
    const [sortConfig, setSortConfig] = useState({
        key: 'createdAt',
        direction: 'desc'
    });
    const [showOnlyReady, setShowOnlyReady] = useState(false);
    const [users, setUsers] = useState([]);
    const [isLoadingUsers, setIsLoadingUsers] = useState(false);
    const [userSortConfig, setUserSortConfig] = useState({
        key: 'createdAt',
        direction: 'desc'
    });
    const [feedbacks, setFeedbacks] = useState([]);
    const [isLoadingFeedbacks, setIsLoadingFeedbacks] = useState(false);

    const tabs = [
        { id: 'coupons', name: 'Coupons', icon: TicketIcon },
        { id: 'feedback', name: 'Feedback', icon: ChatBubbleLeftRightIcon },
        { id: 'users', name: 'Users', icon: UsersIcon },
        { id: 'books', name: 'Books', icon: BookOpenIcon },
    ];

    useEffect(() => {
        const savedBooks = getAdminBooks();
        if (savedBooks.length > 0) {
            setBooks(savedBooks);
        }
    }, []);

    useEffect(() => {
        if (books.length > 0) {
            saveAdminBooks(books);
        }
    }, [books]);

    const handleAdminFormSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const response = await api.post('/admin/coupons/create', {
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
            const response = await api.get('/admin/coupons/list');
            setCoupons(response.data.coupons);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch coupons');
        } finally {
            setIsLoadingCoupons(false);
        }
    };

    const fetchBooks = async () => {
        setIsLoadingBooks(true);
        try {
            const response = await api.get('/admin/books/list');
            setBooks(response.data.books);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch books');
        } finally {
            setIsLoadingBooks(false);
        }
    };

    const fetchBookPDF = async (bookId) => {
        setLoadingPDF(prev => ({ ...prev, [bookId]: true }));
        try {
            const response = await api.get(`/admin/books/${bookId}/pdf`);
            if (response.data.bookPDF) {
                window.open(response.data.bookPDF, '_blank');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch PDF');
        } finally {
            setLoadingPDF(prev => ({ ...prev, [bookId]: false }));
        }
    };

    const fetchUsers = async () => {
        setIsLoadingUsers(true);
        try {
            const response = await api.get('/admin/users/list');
            setUsers(response.data.users);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch users');
        } finally {
            setIsLoadingUsers(false);
        }
    };

    const handleUserSort = (key) => {
        setUserSortConfig(prevConfig => ({
            key,
            direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
        }));
    };

    const handleSort = (key) => {
        setSortConfig(prevConfig => ({
            key,
            direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
        }));
    };

    const fetchFeedbacks = async () => {
        setIsLoadingFeedbacks(true);
        try {
            const response = await api.get('/admin/feedbacks/list');
            setFeedbacks(response.data.feedbacks);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch feedbacks');
        } finally {
            setIsLoadingFeedbacks(false);
        }
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'coupons':
                return (
                    <CouponsTab
                        adminFormData={adminFormData}
                        setAdminFormData={setAdminFormData}
                        handleAdminFormSubmit={handleAdminFormSubmit}
                        error={error}
                        success={success}
                        coupons={coupons}
                        fetchCoupons={fetchCoupons}
                        isLoadingCoupons={isLoadingCoupons}
                    />
                );
            case 'feedback':
                return (
                    <FeedbacksTab
                        feedbacks={feedbacks}
                        fetchFeedbacks={fetchFeedbacks}
                        isLoadingFeedbacks={isLoadingFeedbacks}
                    />
                );
            case 'users':
                return (
                    <UsersTab
                        users={users}
                        fetchUsers={fetchUsers}
                        isLoadingUsers={isLoadingUsers}
                        userSortConfig={userSortConfig}
                        handleUserSort={handleUserSort}
                    />
                );
            case 'books':
                return (
                    <BooksTab
                        books={books}
                        fetchBooks={fetchBooks}
                        isLoadingBooks={isLoadingBooks}
                        timeRange={timeRange}
                        setTimeRange={setTimeRange}
                        selectedBooks={selectedBooks}
                        setSelectedBooks={setSelectedBooks}
                        loadingPDF={loadingPDF}
                        fetchBookPDF={fetchBookPDF}
                        showOnlyReady={showOnlyReady}
                        setShowOnlyReady={setShowOnlyReady}
                        sortConfig={sortConfig}
                        handleSort={handleSort}
                    />
                );
            default:
                return null;
        }
    };

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
