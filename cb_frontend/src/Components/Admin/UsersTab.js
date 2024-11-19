import React from 'react';
import { format, parseISO } from 'date-fns';
import PropTypes from 'prop-types';

const UsersTab = ({
    users,
    fetchUsers,
    isLoadingUsers,
    userSortConfig,
    handleUserSort
}) => {
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

    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden p-6">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Users Management</h3>
                <button
                    onClick={fetchUsers}
                    disabled={isLoadingUsers}
                    className={`px-4 py-2 rounded-md text-sm font-medium text-white
                        ${isLoadingUsers
                            ? 'bg-purple-300 cursor-not-allowed'
                            : 'bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500'
                        }`}
                >
                    {isLoadingUsers ? 'Loading...' : 'Refresh Users'}
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
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
                                    onClick={() => handleUserSort(key)}
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                >
                                    <div className="flex items-center space-x-1">
                                        <span>{label}</span>
                                        {userSortConfig.key === key && (
                                            <span className="text-purple-600">
                                                {userSortConfig.direction === 'asc' ? '↑' : '↓'}
                                            </span>
                                        )}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {sortUsers(users, userSortConfig.key, userSortConfig.direction).map(user => (
                            <tr key={user._id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-500">
                                    {user._id}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                                    {user.email}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="px-2 py-1 text-sm font-medium bg-green-100 text-green-800 rounded-full">
                                        {user.credits}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {user.books.total}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <span className="text-sm text-gray-900">{user.books.finished}</span>
                                        {user.books.total > 0 && (
                                            <span className="ml-2 text-xs text-gray-500">
                                                ({Math.round((user.books.finished / user.books.total) * 100)}%)
                                            </span>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {user.createdAt 
                                        ? format(parseISO(user.createdAt), 'PPp')
                                        : 'No date available'
                                    }
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