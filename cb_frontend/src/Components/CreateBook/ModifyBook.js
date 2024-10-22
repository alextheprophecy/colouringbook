import React, { useRef, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import HTMLFlipBook from 'react-pageflip';
import EditPage from './EditPage';
import { setCurrentPage, setIsEditing, setIsModifyingBook } from '../../redux/bookSlice';

const ModifyBook = () => {
    const dispatch = useDispatch();
    const { pages, currentPage, isEditing } = useSelector(state => state.book);
    const flipBookRef = useRef(null);

    const onFlip = useCallback((e) => {
        dispatch(setCurrentPage(e.data));
    }, [dispatch]);

    const handleNextPage = () => {
        if (flipBookRef.current && currentPage < pages.length - 1) {
            flipBookRef.current.pageFlip().flipNext();
        }
    };

    const handlePreviousPage = () => {
        if (flipBookRef.current && currentPage > 0) {
            flipBookRef.current.pageFlip().flipPrev();
        }
    };

    const toggleEdit = () => {
        dispatch(setIsEditing(!isEditing));
    };

    const handleSubmit = (text, newImage) => {
        // This will be handled in the EditPage component
    };

    const getCurrentPageImage = () => {
        return pages[currentPage]?.image || `https://placehold.co/400x600?text=Page+${currentPage + 1}`;
    };

    const handleBackToCreation = () => {
        dispatch(setCurrentPage(pages.length));
        dispatch(setIsModifyingBook(false));
    };

    return (
        <div className="p-4 bg-blue-100 rounded-[15px] max-w-[900px] mx-auto">
            <div>
                {pages.length > 0 && <button 
                    className="absolute top-2 right-2 bg-[#87CEFA] text-white py-1 px-2 rounded-md cursor-pointer z-10"
                    onClick={toggleEdit}
                >
                    Edit
                </button>}
                
                <HTMLFlipBook
                    width={300}
                    height={450}
                    size="stretch"
                    minWidth={315}
                    maxWidth={1000}
                    minHeight={400}
                    maxHeight={1533}
                    maxShadowOpacity={0.5}
                    mobileScrollSupport={true}
                    ref={flipBookRef}
                    onFlip={onFlip}
                    className="demo-book"
                    showCover={false}
                    useMouseEvents={!isEditing}
                >               
                    {pages.map((page, index) => (
                        <div key={index} className="demoPage bg-[red] rounded-l-lg">
                            <img 
                                src={`https://placehold.co/400x600?text=Page+${page}`} 
                                alt={`Page ${page}`} 
                                className="rounded-[15px] mx-auto w-full h-full object-cover"
                            />
                        </div>
                    ))}
                </HTMLFlipBook>
            </div>

            <div className="flex justify-between mt-4">
                {currentPage > 0 && (
                    <button 
                        className="bg-[#87CEFA] text-white py-2 px-4 rounded-md cursor-pointer z-10"
                        onClick={handlePreviousPage}
                    >
                        Previous
                    </button>
                )}
                {currentPage < pages.length - 1 && (
                    <button 
                        className="bg-[#87CEFA] text-white py-2 px-4 rounded-md cursor-pointer z-10 ml-auto"
                        onClick={handleNextPage}
                    >
                        Next
                    </button>
                )}
            </div>

            <div className="mt-4 flex justify-center">
                <button 
                    className="bg-[green] text-white py-2 px-4 rounded-md cursor-pointer z-10"
                    onClick={handleBackToCreation}
                >
                    Back to Book Creation!
                </button>
            </div>

            <EditPage
                isOpen={isEditing}
                closePopUp={() => dispatch(setIsEditing(false))}
                onSubmit={handleSubmit}
                initialText={""}
                initialImage={getCurrentPageImage()}
            />
        </div>
    );
};

export default ModifyBook;
