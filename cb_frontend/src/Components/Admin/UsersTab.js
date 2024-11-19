import React, { useState, useCallback } from 'react';
import { format, parseISO } from 'date-fns';
import PropTypes from 'prop-types';
import { ShieldBan, ShieldCheck } from 'lucide-react';
import api from '../../Hooks/ApiHandler';

const UsersTab = ({
    users,
    fetchUsers,
    isLoadingUsers
}) => {
    const [sortConfig, setSortConfig] = useState({
        key: 'createdAt',
        direction: 'desc'
    });

    const [blockingUsers, setBlockingUsers] = useState({});

    const handleSort = (key) => {
        setSortConfig(prevConfig => ({
            key,
            direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
        }));
    };

    const sortUsers = (users, key, direction) => {
        return [...users].sort((a, b) => {
            switch (key) {
                case 'email':
                    return direction === 'asc' 
                        ? a.email.localeCompare(b.email)
                        : b.email.localeCompare(a.email);
                case 'credits':
                    return direction === 'asc'
                        ? a.credits - b.credits
                        : b.credits - a.credits;
                case 'totalBooks':
                    return direction === 'asc'
                        ? a.books.total - b.books.total
                        : b.books.total - a.books.total;
                case 'finishedBooks':
                    return direction === 'asc'
                        ? a.books.finished - b.books.finished
                        : b.books.finished - a.books.finished;
                case 'createdAt':
                    return direction === 'asc'
                        ? new Date(a.createdAt) - new Date(b.createdAt)
                        : new Date(b.createdAt) - new Date(a.createdAt);
                default:
                    return 0;
            }
        });
    };

    const handleToggleBlock = useCallback(async (userId) => {
        try {
            setBlockingUsers(prev => ({ ...prev, [userId]: true }));
            
            const response = await api.post(`/admin/users/${userId}/toggle-block`);

            if (!response)throw new Error('Failed to toggle user block status');            

            // Refresh the users list
            fetchUsers();
        } catch (error) {
            console.error('Error toggling user block:', error);
            // You might want to show an error toast here
        } finally {
            setBlockingUsers(prev => ({ ...prev, [userId]: false }));
        }
    }, [fetchUsers]);

    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Users Management</h3>
                <button
                    onClick={fetchUsers}
                    disabled={isLoadingUsers}
                    className={`w-full sm:w-auto px-4 py-2 rounded-md text-sm font-medium text-white
                        ${isLoadingUsers
                            ? 'bg-purple-300 cursor-not-allowed'
                            : 'bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500'
                        }`}
                >
                    {isLoadingUsers ? 'Loading...' : 'Refresh Users'}
                </button>
            </div>

            <div className="overflow-x-auto -mx-4 sm:mx-0">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="hidden sm:table-header-group bg-gray-50">
                        <tr>
                            {[
                                { key: '_id', label: 'User ID' },
                                { key: 'email', label: 'Email' },
                                { key: 'credits', label: 'Credits' },
                                { key: 'totalBooks', label: 'Total Books' },
                                { key: 'finishedBooks', label: 'Finished Books' },
                                { key: 'createdAt', label: 'Joined At' }
                            ].map(({ key, label }) => (
                                <th
                                    key={key}
                                    onClick={() => handleSort(key)}
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
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
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {sortUsers(users, sortConfig.key, sortConfig.direction).map(user => (
                            <tr key={user._id} className="hover:bg-gray-50 flex flex-col sm:table-row">
                                <td className="px-4 sm:px-6 py-2 sm:py-4 hidden sm:table-cell">
                                    <span className="font-mono text-gray-500">{user._id}</span>
                                </td>
                                <td className="px-4 sm:px-6 py-2 sm:py-4">
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                        <div className="flex flex-col sm:block">
                                            <div className="text-blue-600 font-medium flex items-center justify-between">
                                                {user.email}  
                                                <button
                                                    onClick={() => handleToggleBlock(user._id)}
                                                    disabled={blockingUsers[user._id]}
                                                    className={`mt-2 sm:mt-0 px-3 py-1 mr-0 rounded-md text-sm font-medium inline-flex sm:hidden items-center gap-2
                                                        ${user.isBlocked
                                                            ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                                                        } ${blockingUsers[user._id] ? 'opacity-50 cursor-wait' : ''}`}
                                                >
                                                    {blockingUsers[user._id] ? (
                                                        'Processing...'
                                                    ) : (
                                                        <>
                                                            {user.isBlocked ? (
                                                                <>
                                                                    <ShieldBan className="w-4 h-4" />
                                                                    <span>Blocked</span>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <ShieldCheck className="w-4 h-4" />
                                                                    <span>Active</span>
                                                                </>
                                                            )}
                                                        </>
                                                    )}
                                            </button>
                                        </div>
                                        <span className="text-xs text-gray-500 font-mono sm:hidden">{user._id}</span>
                                           
                                        </div>
                                        
                                    </div>
                                </td>
                                <td className="px-4 sm:px-6 py-2 sm:py-4">
                                    <div className="sm:hidden flex items-center justify-between">
                                        <span className="px-2 py-1 text-sm font-medium bg-green-100 text-green-800 rounded-full">
                                            {user.credits}
                                        </span>
                                    </div>
                                    <div className="hidden sm:block">
                                        <span className="sm:hidden font-medium text-gray-900">Credits: </span>
                                        <span className="px-2 py-1 text-sm font-medium bg-green-100 text-green-800 rounded-full">
                                            {user.credits}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-4 sm:px-6 py-2 sm:py-4">
                                    <div className="sm:hidden flex justify-between items-center">
                                        <span className="text-gray-500">Books: {user.books.total}</span>
                                        <span className="text-gray-500">
                                            Finished: {user.books.finished}
                                            {user.books.total > 0 && (
                                                <span className="ml-1 text-xs">
                                                    ({Math.round((user.books.finished / user.books.total) * 100)}%)
                                                </span>
                                            )}
                                        </span>
                                    </div>
                                    <div className="hidden sm:block">
                                        <span className="sm:hidden font-medium text-gray-900">Total Books: </span>
                                        <span className="text-gray-900">{user.books.total}</span>
                                    </div>
                                </td>
                                <td className="px-4 sm:px-6 py-2 sm:py-4 hidden sm:table-cell">
                                    <div className="flex items-center">
                                        <span className="text-gray-900">{user.books.finished}</span>
                                        {user.books.total > 0 && (
                                            <span className="ml-2 text-xs text-gray-500">
                                                ({Math.round((user.books.finished / user.books.total) * 100)}%)
                                            </span>
                                        )}
                                    </div>
                                </td>
                                <td className="px-4 sm:px-6 py-2 sm:py-4 border-b sm:border-b-0">
                                    <span className="text-gray-500 text-sm">
                                        {user.createdAt 
                                            ? format(parseISO(user.createdAt), 'PPp')
                                            : 'No date available'
                                        }
                                    </span>
                                </td>
                                <td className="px-4 hidden sm:table-cell">
                                    <button
                                        onClick={() => handleToggleBlock(user._id)}
                                        disabled={blockingUsers[user._id]}
                                        className={`mt-2 sm:mt-0 px-3 py-1 rounded-md text-sm font-medium inline-flex items-center gap-2
                                                ${user.isBlocked
                                                    ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                                                } ${blockingUsers[user._id] ? 'opacity-50 cursor-wait' : ''}`}
                                        >
                                            {blockingUsers[user._id] ? (
                                                'Processing...'
                                            ) : (
                                                <>
                                                    {user.isBlocked ? (
                                                        <>
                                                            <ShieldBan className="w-4 h-4" />
                                                        </>
                                                    ) : (
                                                        <>
                                                            <ShieldCheck className="w-4 h-4" />
                                                        </>
                                                    )}
                                                </>
                                            )}
                                        </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {users.length === 0 && !isLoadingUsers && (
                <div className="text-center py-8 text-gray-500">
                    No users found. Click &ldquo;Refresh Users&rdquo; to load the users.
                </div>
            )}
        </div>
    );
};



export default UsersTab; 