import React from 'react';
import { format, parseISO } from 'date-fns';

const BooksList = ({
    books,
    fetchBooks,
    isLoadingBooks,
    loadingPDF,
    fetchBookPDF
}) => {
    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden p-6">
            <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Books Management</h3>
            </div>

            <button
                onClick={fetchBooks}
                disabled={isLoadingBooks}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
                    ${isLoadingBooks
                        ? 'bg-purple-300 cursor-not-allowed'
                        : 'bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500'
                    }`}
            >
                {isLoadingBooks ? 'Loading...' : 'Fetch Books'}
            </button>

            <div className="mt-6">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>                                
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Title
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status/Actions
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    User
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Page Count
                                </th>
                                
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Created At
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Book ID
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {books.map((book) => (
                                <tr key={book._id} className="hover:bg-gray-50">
                                    
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {book.title}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center space-x-2">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                ${book.finished 
                                                    ? 'bg-green-100 text-green-800' 
                                                    : 'bg-yellow-100 text-yellow-800'}`}
                                            >
                                                {book.finished ? 'Finished' : 'In Progress'}
                                            </span>
                                            {book.finished && (
                                                <button
                                                    onClick={() => fetchBookPDF(book._id)}
                                                    disabled={loadingPDF[book._id]}
                                                    className={`px-3 py-1 rounded-md text-xs font-medium
                                                        ${loadingPDF[book._id]
                                                            ? 'bg-purple-100 text-purple-400 cursor-wait'
                                                            : 'bg-purple-600 text-white hover:bg-purple-700'
                                                        }
                                                    `}
                                                >
                                                    {loadingPDF[book._id] ? 'Loading...' : 'View PDF'}
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <div className="flex flex-col">
                                            <span className="font-mono text-xs text-gray-400">{book.userId}</span>
                                            <span className="text-blue-600">{book.userEmail}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {book.pageCount}
                                    </td>
                                    
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {format(parseISO(book.createdAt), 'PPp')}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-500">
                                        {book._id}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {books.length === 0 && !isLoadingBooks && (
                <div className="text-center py-8 text-gray-500">
                    No books found. Click &ldquo;Fetch Books&rdquo; to load the books.
                </div>
            )}
        </div>
    );
};

export default BooksList; 