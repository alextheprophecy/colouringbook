import React from 'react';
import BooksGraph from './BooksGraph';
import BooksList from './BooksList';

const BooksTab = ({
    books,
    fetchBooks,
    isLoadingBooks,
    timeRange,
    setTimeRange,
    selectedBooks,
    setSelectedBooks,
    loadingPDF,
    fetchBookPDF,
    showOnlyReady,
    setShowOnlyReady,
    sortConfig,
    handleSort
}) => {
    return (
        <>
            <BooksGraph
                books={books}
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
            <BooksList
                books={books}
                fetchBooks={fetchBooks}
                isLoadingBooks={isLoadingBooks}
                loadingPDF={loadingPDF}
                fetchBookPDF={fetchBookPDF}
            />
        </>
    );
};

export default BooksTab; 