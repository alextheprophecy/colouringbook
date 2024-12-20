import React, { useEffect, useState } from 'react';
import { StarIcon } from '@heroicons/react/24/solid';
import { Trash2 } from 'lucide-react';
import axios from 'axios';
import { format, parseISO } from 'date-fns';
import api from '../../Hooks/ApiHandler';

const FeedbacksTab = ({ feedbacks, fetchFeedbacks, isLoadingFeedbacks }) => {
    const [sortConfig, setSortConfig] = useState({
        key: 'createdAt',
        direction: 'desc'
    });
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [feedbackToDelete, setFeedbackToDelete] = useState(null);

    useEffect(() => {
        fetchFeedbacks();
    }, []);

    const handleSort = (key) => {
        setSortConfig(prevConfig => ({
            key,
            direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
        }));
    };

    const sortFeedbacks = (feedbacks, key, direction) => {
        return [...feedbacks].sort((a, b) => {
            switch (key) {
                case 'userEmail':
                    return direction === 'asc'
                        ? a.userEmail.localeCompare(b.userEmail)
                        : b.userEmail.localeCompare(a.userEmail);
                case 'rating':
                    return direction === 'asc'
                        ? a.rating - b.rating
                        : b.rating - a.rating;
                case 'route':
                    return direction === 'asc'
                        ? a.route.localeCompare(b.route)
                        : b.route.localeCompare(a.route);
                case 'comment':
                    return direction === 'asc'
                        ? (a.comment || '').localeCompare(b.comment || '')
                        : (b.comment || '').localeCompare(a.comment || '');
                case 'createdAt':
                    return direction === 'asc'
                        ? new Date(a.createdAt) - new Date(b.createdAt)
                        : new Date(b.createdAt) - new Date(a.createdAt);
                default:
                    return 0;
            }
        });
    };

    const renderStars = (rating) => {
        return [...Array(5)].map((_, index) => (
            <StarIcon
                key={index}
                className={`h-5 w-5 ${
                    index < rating ? 'text-yellow-400' : 'text-gray-300'
                }`}
            />
        ));
    };

    const getRouteColor = (route) => {
        const colors = {
            'OTHER': 'bg-gray-100 text-gray-800',
            'HOME': 'bg-blue-100 text-blue-800',
            'GALLERY': 'bg-purple-100 text-purple-800',
            'PROFILE': 'bg-green-100 text-green-800',
            'CREATION': 'bg-pink-100 text-pink-800'
        };
        return colors[route] || 'bg-gray-100 text-gray-800';
    };

    const handleDeleteClick = (feedback) => {
        setFeedbackToDelete(feedback);
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = async () => {
        try {
            await api.delete(`/admin/feedbacks/${feedbackToDelete._id}`);
            setShowDeleteModal(false);
            setFeedbackToDelete(null);
            fetchFeedbacks(); // Refresh the list
        } catch (error) {
            console.error('Error deleting feedback:', error);
            // You might want to show an error message to the user here
        }
    };

    const DeleteConfirmationModal = () => {
        if (!showDeleteModal) return null;

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
                    <h3 className="text-lg font-medium mb-4">Delete Feedback</h3>
                    <p className="text-gray-600 mb-6">
                        Are you sure you want to delete this feedback? This action cannot be undone.
                    </p>
                    <div className="flex justify-end space-x-3">
                        <button
                            onClick={() => setShowDeleteModal(false)}
                            className="px-4 py-2 text-gray-600 hover:text-gray-800"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleConfirmDelete}
                            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    if (isLoadingFeedbacks) {
        return (
            <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow">
            <DeleteConfirmationModal />
            <div className="px-2 sm:px-4 py-3 sm:py-5">
                <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4 flex flex-wrap items-center gap-2">
                    <button 
                        className="bg-purple-500 hover:bg-purple-700 text-white text-sm font-bold py-2 px-4 rounded" 
                        onClick={fetchFeedbacks}
                    >
                        Refresh
                    </button>
                    <span>User Feedback</span>
                </h3>
                
                <div className="overflow-x-auto -mx-2 sm:mx-0">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="hidden sm:table-header-group">
                            <tr>
                                {[
                                    { key: 'userEmail', label: 'User' },
                                    { key: 'rating', label: 'Rating' },
                                    { key: 'route', label: 'Route' },
                                    { key: 'comment', label: 'Comment' },
                                    { key: 'createdAt', label: 'Date' }
                                ].map(({ key, label }) => (
                                    <th 
                                        key={key}
                                        onClick={() => handleSort(key)}
                                        className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                    >
                                        <div className="flex items-center space-x-1">
                                            <span>{label}</span>
                                            {sortConfig.key === key && (
                                                <span className="text-purple-600">
                                                    {sortConfig.direction === 'asc' ? '↑' : '↓'}
                                                </span>
                                            )}
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {sortFeedbacks(feedbacks, sortConfig.key, sortConfig.direction).map((feedback) => (
                                <tr key={feedback._id} className="hover:bg-gray-50 flex flex-col sm:table-row">
                                    <td className="px-4 sm:px-6 py-2 sm:py-4 text-sm text-gray-900">
                                        <span className="sm:hidden font-medium">User: </span>
                                        {feedback.userEmail}
                                    </td>
                                    <td className="px-4 sm:px-6 py-2 sm:py-4">
                                        <span className="sm:hidden font-medium">Rating: </span>
                                        <div className="flex">
                                            {renderStars(feedback.rating)}
                                        </div>
                                    </td>
                                    <td className="px-4 sm:px-6 py-2 sm:py-4">
                                        <span className="sm:hidden font-medium">Route: </span>
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${getRouteColor(feedback.route)}`}>
                                            {feedback.route}
                                        </span>
                                    </td>
                                    <td className="px-4 sm:px-6 py-2 sm:py-4 text-sm text-gray-500">
                                        <span className="sm:hidden font-medium text-gray-900">Comment: </span>
                                        {feedback.comment}
                                    </td>
                                    <td className="px-4 sm:px-6 py-2 sm:py-4 text-sm text-gray-500">
                                        <span className="sm:hidden font-medium text-gray-900">Date: </span>
                                        {new Date(feedback.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-4 sm:px-6 py-2 sm:py-4">
                                        <button
                                            onClick={() => handleDeleteClick(feedback)}
                                            className="text-red-500 hover:text-red-700 transition-colors"
                                            title="Delete feedback"
                                        >
                                            <Trash2 className="h-5 w-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default FeedbacksTab;
