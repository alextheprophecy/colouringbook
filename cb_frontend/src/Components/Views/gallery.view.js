import {useEffect, useState} from "react";
import api from "../../Hooks/ApiHandler";
import ExamplesView from "./example_books.view";
import FlipBook from "../flip_book.component";
import '../../Styles/gallery.css'
import {getBookData, saveBookData, isUserLoggedIn} from "../../Hooks/UserDataHandler";
import { RefreshCw, Download, Plus } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { setAskFeedback, addNotification } from '../../redux/websiteSlice';
import { useTranslation } from 'react-i18next';
// Replace the single constant with two constants
const LOADING_TIMES = Object.freeze({
    INITIAL: 330,
    BATCH: 2000
});

const SkeletonLoader = () => (
    <div className="w-full max-w-4xl mx-auto mb-6 h-32 p-4 bg-white rounded-lg shadow-md relative overflow-hidden">
        <div className="animate-pulse h-full">
            <div className="flex justify-between items-center h-full">
                {/* Left side content */}
                <div className="flex flex-col h-full justify-between">
                    <div>
                        {/* Shorter title with two lines */}
                        <div className="h-12 w-32 bg-gray-200 rounded"></div>
                        <div className="h-4 w-32 bg-gray-200 rounded mt-2"></div>
                        <div className="h-4 w-24 bg-gray-200 rounded mt-2"></div>
                    </div>
                </div>
                {/* Right side content - more compact grouping */}
                <div className="flex flex-col h-full justify-center items-end gap-2">
                    <div className="h-10 w-32 bg-gray-200 rounded"></div>
                    <div className="h-4 w-24 bg-gray-200 rounded"></div>
                </div>
            </div>
        </div>
    </div>
);

const GalleryView = () =>  {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);
    const [processedBooks, setProcessedBooks] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [loadingMore, setLoadingMore] = useState(false);
    const { t } = useTranslation();
    // Helper function to preload an image
    const preloadImage = (url) => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.src = url;
            img.onload = () => resolve(url);
            img.onerror = () => reject();
        });
    };

    const loadMoreBooks = async () => {
        setLoadingMore(true);
        const startTime = Date.now();

        try {
            const response = await api.get('user/getBooks', {
                params: { page: currentPage + 1 }
            });
            
            if (!response) return;
            
            const { books, totalCount } = response.data;
            
            // Preload all images in parallel
            const booksWithLoadedImages = await Promise.all(
                books.map(async (book) => {
                    try {
                        if (book.coverImage) {
                            await preloadImage(book.coverImage);
                        }
                        return book;
                    } catch (error) {
                        console.warn(`Failed to load image for book ${book.id}`);
                        return { ...book, coverImage: null };
                    }
                })
            );
            
            const elapsedTime = Date.now() - startTime;
            const remainingTime = Math.max(0, LOADING_TIMES.BATCH - elapsedTime);
            await new Promise(resolve => setTimeout(resolve, remainingTime));

            // Save scroll position right before updating content
            const currentScrollPosition = window.scrollY;

            // Update state
            setProcessedBooks(prev => [...prev, ...booksWithLoadedImages]);
            setCurrentPage(prev => prev + 1);

            // Restore scroll position after state updates
            requestAnimationFrame(() => {
                window.scrollTo({
                    top: currentScrollPosition,
                    behavior: 'instant'
                });
            });

            // Update user data with the total book count
            saveBookData({books: booksWithLoadedImages,
                bookCount: totalCount
            });

        } catch (error) {
            dispatch(addNotification({
                type: 'error',
                message: error.message || t('gallery.failed-to-load-books-please-try-again'),
                duration: 5000
            }));
        } finally {
            setLoadingMore(false);
        }
    };

    const loadValues = async () => {
        setLoading(true);
        const startTime = Date.now();
        
        try {
            const response = await api.get('user/getBooks');
            if (!response) return;
            
            const { books, totalCount } = response.data;
            
            const booksWithLoadedImages = await Promise.all(
                books.map(async (book) => {
                    try {
                        if (book.coverImage) {
                            await preloadImage(book.coverImage);
                        }
                        return book;
                    } catch (error) {
                        console.warn(`Failed to load image for book ${book.id}`);
                        return { ...book, coverImage: null };
                    }
                })
            );

            const elapsedTime = Date.now() - startTime;
            const remainingTime = Math.max(0, LOADING_TIMES.BATCH - elapsedTime);
            await new Promise(resolve => setTimeout(resolve, remainingTime));
            
            setProcessedBooks(booksWithLoadedImages);
            setCurrentPage(0);
            saveBookData({books: booksWithLoadedImages,
                bookCount: totalCount
            });
        } catch (error) {
            dispatch(addNotification({
                type: 'error',
                message: error.message || t('gallery.failed-to-load-books-please-try-again'),
                duration: 5000
            }));
        } finally {
            setLoading(false);
            dispatch(setAskFeedback(true));
        }
    };

    const initializeGallery = async () => {
        setLoading(true);
        const startTime = Date.now();

        const books = getBookData()?.books;
        if (books) {
            // Preload images for existing books
            const booksWithLoadedImages = await Promise.all(
                books.map(async (book) => {
                    try {
                        if (book.coverImage) {
                            await preloadImage(book.coverImage);
                        }
                        return book;
                    } catch (error) {
                        console.warn(`Failed to load image for book ${book.id}`);
                        return { ...book, coverImage: null };
                    }
                })
            );
            
            const elapsedTime = Date.now() - startTime;
            const remainingTime = Math.max(0, LOADING_TIMES.INITIAL - elapsedTime);
            await new Promise(resolve => setTimeout(resolve, remainingTime));
            
            setProcessedBooks(booksWithLoadedImages);            
        } else {
            // Only fetch from API if no cached books exist
            await loadValues();
            return;
        }
        
        setLoading(false);
    };

    useEffect(() => {
        if (isUserLoggedIn()) initializeGallery();
        else window.location.href = '/login';
        
    }, []);

    const downloadBook = (book) => {
        api.get('image/getBookPDF', {params: {bookId: book.id}}).then(r => {
            if(!r) return
            console.log('yippee', r)

            const url = r.data
            console.log(url)
            // Create a temporary <a> element and trigger the download
            const link = document.createElement('a');
            link.href = url;
            link.download = `ColouringBook.pdf`; // Set filename for the download
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            // Show feedback prompt after successful download
            dispatch(setAskFeedback(true));
        })
    }

    const showBooks = () => {
        return processedBooks.map(book => (
            <div 
                key={book.id} 
                className={`w-full max-w-4xl mx-auto mb-6 ${book.coverImage ? 'h-48' : 'h-32'} p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow relative overflow-hidden`}
            >
                {/* Background Image */}
                <div 
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
                    style={{ backgroundImage: book.coverImage ? `url(${book.coverImage})` : 'none' }}
                />
                
                {/* Content Overlay */}
                <div className="relative z-10 flex justify-between items-center h-full">
                    <div className="flex flex-col h-full justify-center gap-2">
                        <div className="overflow-hidden">
                            <h2 className="text-l font-semibold text-gray-800 line-clamp-2">{book.title}</h2>
                        </div>
                        <div className="flex-shrink-0">
                            <p className="text-sm text-blue-800">
                                {new Date(book.creationDate).toLocaleDateString()}
                            </p>
                            <p className="text-sm text-gray-600">{book.pageCount} page{book.pageCount === 1 ? '' : 's'}</p>
                        </div>
                    </div>
                    <div className="flex flex-col h-full justify-center items-end gap-2">
                        <button 
                            onClick={() => downloadBook(book)}
                            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors flex items-center gap-2"
                        >
                            <Download className="w-4 h-4" />
                            {t('gallery.download')} </button>
                        <span className="text-sm text-gray-400">{book.id}</span>
                    </div>
                </div>
            </div>
        ));
    }

    const renderBookCount = () => {
        const bookData = getBookData();
        if (!bookData?.bookCount) return '';
        
        const hiddenBooks = bookData.bookCount - processedBooks.length;
        if (hiddenBooks <= 0) return null;

        const skeletonCount = Math.min(hiddenBooks, 7); // Show max 7 skeletons
        
        return (
            <div className="flex justify-center w-full">
                {loadingMore ? (
                    // Show skeletons when loading
                    <div className="w-full max-w-4xl">
                        {Array.from({ length: skeletonCount }).map((_, index) => (
                            <SkeletonLoader key={`skeleton-${currentPage}-${index}`} />
                        ))}
                    </div>
                ) : (
                    // Show the "load more" button when not loading
                    <button 
                        onClick={loadMoreBooks}
                        disabled={loadingMore}
                        className="w-full max-w-4xl p-4 bg-gray-50 hover:bg-gray-100 rounded-lg shadow-sm transition-colors duration-200"
                    >
                        <p className="text-center text-gray-600 flex items-center justify-center gap-2">
                            {loadingMore ? (
                                <RefreshCw className="w-4 h-4 animate-spin" />
                            ) : null}
                            + {hiddenBooks}{t('gallery.more-books-in-your-library')}
                        </p>
                    </button>
                )}
            </div>
        );
    };

    return (
        <div className="relative h-screen overflow-y-auto" id="gallery-container">
            {/* Refresh Button */}
            <button 
                onClick={loadValues}
                className="absolute top-4 right-6 p-2 rounded-full bg-green-500 hover:bg-green-600 transition-colors"
                title={t('gallery.refresh-books')}
            >
                <RefreshCw 
                    className={`w-6 h-6 text-white ${loading ? 'animate-spin' : ''}`}
                />
            </button>

            <div className="space-y-4 mt-16 w-[90vw] mx-auto">
                {loading ? (
                    <>
                        <SkeletonLoader />
                        <SkeletonLoader />
                        <SkeletonLoader />
                        <SkeletonLoader />
                        <SkeletonLoader />
                    </>
                ) : (
                    <>
                        {processedBooks.length > 0 ? (
                            <>
                                {showBooks()}
                                {renderBookCount()}
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center min-h-[60vh] bg-white/80 rounded-lg shadow-md p-8">
                                <div className="text-center mb-8">
                                    <h2 className="text-2xl font-children font-semibold text-gray-800 mb-3">
                                        {t('gallery.no-books-yet')}
                                    </h2>
                                    <p className="text-gray-600 max-w-md mx-auto">
                                        {t('gallery.start-your-creative-journey')}
                                    </p>
                                </div>
                                <a 
                                    href="/create"
                                    className="px-6 py-3 bg-blue-500 text-white rounded-lg 
                                             hover:bg-blue-600 transition-colors duration-200
                                             flex items-center gap-2 font-children font-semibold
                                             shadow-md hover:shadow-lg transform hover:scale-[1.02]"
                                >
                                    <Plus className="w-5 h-5" />
                                    {t('gallery.create-first-book')}
                                </a>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

export default GalleryView
