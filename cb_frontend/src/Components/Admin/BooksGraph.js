import React, { useState } from 'react';
import { 
    LineChart, 
    Line, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer 
} from 'recharts';
import { format, parseISO, subDays, startOfDay, endOfDay } from 'date-fns';

const BooksGraph = ({
    books,
    timeRange,
    setTimeRange,
    selectedBooks,
    setSelectedBooks,
    loadingPDF,
    fetchBookPDF,
    showOnlyReady,
    setShowOnlyReady
}) => {
    const [sortConfig, setSortConfig] = useState({
        key: 'createdAt',
        direction: 'desc'
    });

    const handleSort = (key) => {
        setSortConfig(prevConfig => ({
            key,
            direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
        }));
    };

    const getChartData = () => {
        const endDate = endOfDay(new Date());
        const startDate = startOfDay(timeRange === 'day' 
            ? new Date() 
            : subDays(endDate, 7)
        );

        const filteredBooks = books.filter(book => {
            const bookDate = parseISO(book.createdAt);
            return bookDate >= startDate && bookDate <= endDate;
        });

        const groupedBooks = filteredBooks.reduce((acc, book) => {
            const bookDate = parseISO(book.createdAt);
            const timeKey = timeRange === 'day'
                ? format(bookDate, 'HH:mm')
                : format(bookDate, 'MM/dd');

            if (!acc[timeKey]) {
                acc[timeKey] = {
                    time: timeKey,
                    count: 0,
                    books: []
                };
            }
            acc[timeKey].count++;
            acc[timeKey].books.push(book);
            return acc;
        }, {});

        return Object.values(groupedBooks).sort((a, b) => {
            if (timeRange === 'day') {
                return a.time.localeCompare(b.time);
            } else {
                const [aMonth, aDay] = a.time.split('/');
                const [bMonth, bDay] = b.time.split('/');
                return new Date(2024, aMonth - 1, aDay) - new Date(2024, bMonth - 1, bDay);
            }
        });
    };

    const handleDataPointClick = (data) => {
        if (data && data.activePayload) {
            setSelectedBooks(data.activePayload[0].payload.books);
        }
    };

    const sortBooks = (books, key, direction) => {
        return [...books].sort((a, b) => {
            switch (key) {
                case 'title':
                case 'userEmail':
                case '_id':
                    return direction === 'asc' 
                        ? a[key].localeCompare(b[key])
                        : b[key].localeCompare(a[key]);
                case 'pageCount':
                    return direction === 'asc' 
                        ? a[key] - b[key]
                        : b[key] - a[key];
                case 'createdAt':
                    return direction === 'asc'
                        ? new Date(a[key]) - new Date(b[key])
                        : new Date(b[key]) - new Date(a[key]);
                case 'status':
                    return direction === 'asc'
                        ? (a.finished === b.finished ? 0 : a.finished ? 1 : -1)
                        : (a.finished === b.finished ? 0 : a.finished ? -1 : 1);
                default:
                    return 0;
            }
        });
    };

    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden p-4 sm:p-6 mb-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Books Creation Timeline</h3>
                <div className="flex space-x-4 w-full sm:w-auto">
                    <button
                        onClick={() => setTimeRange('day')}
                        className={`flex-1 sm:flex-none px-3 py-1 rounded-md ${
                            timeRange === 'day'
                                ? 'bg-purple-600 text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                    >
                        Today
                    </button>
                    <button
                        onClick={() => setTimeRange('week')}
                        className={`flex-1 sm:flex-none px-3 py-1 rounded-md ${
                            timeRange === 'week'
                                ? 'bg-purple-600 text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                    >
                        Past Week
                    </button>
                </div>
            </div>

            <div className="h-[300px] -mx-4 sm:mx-0">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        data={getChartData()}
                        onClick={handleDataPointClick}
                        margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                            dataKey="time"
                            interval="preserveStartEnd"
                            tick={{ fontSize: 12 }}
                            padding={{ left: 10, right: 10 }}
                        />
                        <YAxis 
                            allowDecimals={false}
                            padding={{ top: 20, bottom: 20 }}
                            tick={{ fontSize: 12 }}
                            width={30}
                        />
                        <Tooltip
                            content={({ active, payload }) => {
                                if (active && payload && payload.length) {
                                    return (
                                        <div className="bg-white p-2 sm:p-3 border rounded shadow-lg text-sm">
                                            <p className="font-semibold">{payload[0].payload.time}</p>
                                            <p className="text-purple-600">
                                                Books created: {payload[0].value}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                Click to view books
                                            </p>
                                        </div>
                                    );
                                }
                                return null;
                            }}
                        />
                        <Line
                            type="monotone"
                            dataKey="count"
                            stroke="#9333ea"
                            strokeWidth={2}
                            dot={{ r: 3 }}
                            activeDot={{ r: 5 }}
                            connectNulls
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {selectedBooks.length > 0 && (
                <div className="mt-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0 mb-3">
                        <h4 className="font-semibold text-gray-900">
                            Selected Time Period Books ({selectedBooks.length})
                        </h4>
                        <label className="flex items-center space-x-2 cursor-pointer">
                            <span className="text-sm text-gray-600">Show only ready books</span>
                            <div 
                                onClick={() => setShowOnlyReady(!showOnlyReady)}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ease-in-out duration-200 
                                    ${showOnlyReady ? 'bg-purple-600' : 'bg-gray-200'}`}
                            >
                                <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition ease-in-out duration-200
                                        ${showOnlyReady ? 'translate-x-6' : 'translate-x-1'}`}
                                />
                            </div>
                        </label>
                    </div>

                    <div className="overflow-x-auto -mx-4 sm:mx-0">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="hidden sm:table-header-group bg-gray-50 sticky top-0">
                                <tr>
                                    {[
                                        { key: 'status', label: 'Status/Actions' },
                                        { key: 'title', label: 'Title' },
                                        { key: '_id', label: 'Book ID' },
                                        { key: 'userEmail', label: 'User' },
                                        { key: 'pageCount', label: 'Pages' },
                                        { key: 'createdAt', label: 'Created At' }
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
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {sortBooks(selectedBooks, sortConfig.key, sortConfig.direction)
                                    .filter(book => !showOnlyReady || book.finished)
                                    .map(book => (
                                    <tr key={book._id} className="hover:bg-gray-50 flex flex-col sm:table-row">
                                        <td className="px-4 sm:px-6 py-2 sm:py-4">
                                            <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
                                                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
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
                                                        className={`px-3 py-1 rounded-md text-xs font-medium w-full sm:w-auto text-center
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
                                        <td className="px-4 sm:px-6 py-2 sm:py-4">
                                            <span className="sm:hidden font-medium text-gray-900">Title: </span>
                                            <span className="text-sm text-gray-900">{book.title}</span>
                                        </td>
                                        <td className="px-4 sm:px-6 py-2 sm:py-4">
                                            <span className="sm:hidden font-medium text-gray-900">User: </span>
                                            <span className="text-sm text-blue-600">{book.userEmail}</span>
                                        </td>
                                        <td className="px-4 sm:px-6 py-2 sm:py-4">
                                            <span className="sm:hidden font-medium text-gray-900">Pages: </span>
                                            <span className="text-sm text-gray-900">{book.pageCount}</span>
                                        </td>
                                        <td className="px-4 sm:px-6 py-2 sm:py-4 border-b sm:border-b-0">
                                            <span className="sm:hidden font-medium text-gray-900">Created: </span>
                                            <span className="text-sm text-gray-500">
                                                {format(parseISO(book.createdAt), 'PPp')}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BooksGraph; 