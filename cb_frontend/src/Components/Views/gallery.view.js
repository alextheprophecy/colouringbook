import {useEffect, useState} from "react";
import api from "../../Hooks/ApiHandler";
import ExamplesView from "./example_books.view";
import FlipBook from "../flip_book.component";
import '../../Styles/gallery.css'
import {getBookData, saveBookData} from "../../Hooks/UserDataHandler";
import { RefreshCw, Download } from 'lucide-react';

// Add this constant at the top of the file
const MIN_LOADING_TIME = Object.freeze(1000); // 5 seconds for testing

const SkeletonLoader = () => (
    <div className="w-full max-w-4xl mx-auto mb-6 h-48 p-4 bg-white rounded-lg shadow-md relative overflow-hidden">
        <div className="animate-pulse h-full">
            <div className="flex justify-between items-center h-full">
                {/* Left side content */}
                <div className="flex flex-col h-full justify-between">
                    <div className="space-y-2">
                        <div className="h-7 w-48 bg-gray-200 rounded"></div>
                        <div className="h-4 w-32 bg-gray-200 rounded"></div>
                        <div className="h-4 w-24 bg-gray-200 rounded mt-2"></div>
                    </div>
                </div>
                {/* Right side content */}
                <div className="flex flex-col h-full justify-between items-end">
                    <div className="h-10 w-24 bg-gray-200 rounded"></div>
                    <div className="h-4 w-32 bg-gray-200 rounded"></div>
                </div>
            </div>
        </div>
    </div>
);

const GalleryView = () =>  {
    const [loading, setLoading] = useState(false);
    const [processedBooks, setProcessedBooks] = useState([]);

    // Helper function to preload an image
    const preloadImage = (url) => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.src = url;
            img.onload = () => resolve(url);
            img.onerror = () => reject();
        });
    };

    const loadValues = async () => {
        setLoading(true);
        const startTime = Date.now();
        
        try {
            const response = await api.get('user/getBooks');
            if (!response) return;
            
            const books = response.data;
            
            // Preload all images in parallel
            const booksWithLoadedImages = await Promise.all(
                books.map(async (book) => {
                    try {
                        if (book.coverImage) {
                            await preloadImage(book.coverImage);
                        }
                        return book;
                    } catch (error) {
                        // If image fails to load, return book without image
                        console.warn(`Failed to load image for book ${book.id}`);
                        return { ...book, coverImage: null };
                    }
                })
            );

            // Calculate remaining time to meet minimum loading duration
            const elapsedTime = Date.now() - startTime;
            const remainingTime = Math.max(0, MIN_LOADING_TIME - elapsedTime);
            
            // Wait for the remaining time if needed
            await new Promise(resolve => setTimeout(resolve, remainingTime));
            
            setProcessedBooks(booksWithLoadedImages);
            saveBookData(booksWithLoadedImages);
        } catch (error) {
            console.error('Error loading books:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const books = getBookData()
        if(books) setProcessedBooks(books)
        else loadValues()
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
                    <div className="flex flex-col h-full justify-between">
                        <div>
                            <h2 className="text-2xl font-semibold text-gray-800">{book.title}</h2>
                            <p className="text-sm text-blue-800">
                                {new Date(book.creationDate).toLocaleDateString()}
                            </p>
                            <p className="text-sm text-gray-600 mt-2">{book.pageCount} page{book.pageCount === 1 ? '' : 's'}</p>
                        </div>
                    </div>
                    <div className="flex flex-col h-full justify-center items-end gap-2">
                        <button 
                            onClick={() => downloadBook(book)}
                            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors flex items-center gap-2"
                        >
                            <Download className="w-4 h-4" />
                            Download
                        </button>
                        <span className="text-sm text-gray-400">{book.id}</span>
                    </div>
                </div>
            </div>
        ));
    }

    return (
        <div className="container mx-auto px-4 py-8 relative">
            {/* Refresh Button */}
            <button 
                onClick={loadValues}
                className="absolute top-4 right-4 p-3 rounded-full bg-green-500 hover:bg-green-600 transition-colors"
                title="Refresh books"
            >
                <RefreshCw 
                    className={`w-6 h-6 text-white ${loading ? 'animate-spin' : ''}`}
                />
            </button>

            <div className="space-y-4 mt-16">
                {loading ? (
                    <>
                        <SkeletonLoader />
                        <SkeletonLoader />
                        <SkeletonLoader />
                        <SkeletonLoader />
                        <SkeletonLoader />
                    </>
                ) : (
                    showBooks()
                )}
            </div>
        </div>
    );
}

export default GalleryView
