import React, { useRef, useCallback, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import HTMLFlipBook from 'react-pageflip';
import EditPage from './EditPage';
import { setCurrentPage, setIsEditing, setIsModifyingBook } from '../../redux/bookSlice';

const ModifyBook = () => {
    // Group all constants
    const FLIP_TIMES = {
        USER: 600,
        ANIMATION_DELAY: 750,
        ANIMATION_COVER: 1500,
        ANIMATION_FLIP: 350
    };

    // Group all hooks
    const dispatch = useDispatch();
    const { pages, currentPage, isEditing, isModifyingBook } = useSelector(state => state.book);
    const flipBookRef = useRef(null);
    const [isFlipping, setIsFlipping] = useState(false);

    // Helper functions
    const getCurrentPageImage = () => {
        return pages[currentPage]?.image || `https://placehold.co/400x600?text=Page+${currentPage + 1}`;
    };

    const getBookInstance = () => flipBookRef.current?.pageFlip();

    // Animation handlers
    const startAnimation = useCallback((lastPageIndex=pages.length - 1) => {
        const book = getBookInstance();
        if (!book || isFlipping) return;

        setIsFlipping(true);
        book.getSettings().disableFlipByClick = true;
        
        let currentPageIndex = 0;
        const flipThroughPages = () => {
            book.getSettings().flippingTime = currentPageIndex === 0 
                ? FLIP_TIMES.ANIMATION_COVER 
                : FLIP_TIMES.ANIMATION_FLIP;

            if (currentPageIndex < lastPageIndex) {
                book.flipNext('top');
                currentPageIndex++;
                
                const delay = currentPageIndex === 1 ? (FLIP_TIMES.ANIMATION_COVER/3) : FLIP_TIMES.ANIMATION_FLIP;
                setTimeout(() => {
                    dispatch(setCurrentPage(currentPageIndex));
                    flipThroughPages();
                }, delay);
            } else {
                setTimeout(() => {
                    setIsFlipping(false);
                    book.getSettings().flippingTime = FLIP_TIMES.USER;
                    book.getSettings().disableFlipByClick = false;
                }, FLIP_TIMES.USER);
            }
        };

        setTimeout(flipThroughPages, FLIP_TIMES.ANIMATION_DELAY);
    }, [dispatch, isFlipping, pages.length]);

    // Event handlers
    const onFlip = useCallback((e) => {
        if (!isFlipping) {
            dispatch(setCurrentPage(e.data));
        }
    }, [dispatch, isFlipping]);

    const handleNextPage = () => {
        if (!isFlipping && currentPage < pages.length - 1) {
            getBookInstance()?.flipNext('top');
        }
    };

    const handlePreviousPage = () => {
        if (!isFlipping && currentPage > 0) {
            getBookInstance()?.flipPrev('top');
        }
    };

    const toggleEdit = () => {
        if (!isFlipping) {
            dispatch(setIsEditing(!isEditing));
        }
    };

    const handleBackToCreation = () => {
        dispatch(setIsModifyingBook(false));
        dispatch(setCurrentPage(pages.length));
    };

    // Render helpers
    const renderNavigationButtons = () => (
        <div className="flex justify-between mt-4">
            {currentPage > 0 && (
                <button 
                    className={`bg-[#87CEFA] text-white py-2 px-4 rounded-md ${isFlipping ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                    onClick={handlePreviousPage}
                    disabled={isFlipping}
                >
                    Previous
                </button>
            )}
            {currentPage < pages.length - 1 && (
                <button 
                    className={`bg-[#87CEFA] text-white py-2 px-4 rounded-md ${isFlipping ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ml-auto`}
                    onClick={handleNextPage}
                    disabled={isFlipping}
                >
                    Next
                </button>
            )}
        </div>
    );

    return (
        <div className="p-4 bg-blue-100 rounded-[15px] max-w-[900px] mx-auto">
            <div>
                {pages.length > 0 && (
                    <button 
                        className={`absolute top-2 right-2 bg-[#87CEFA] text-white py-1 px-2 rounded-md ${isFlipping ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                        onClick={toggleEdit}
                        disabled={isFlipping}
                    >
                        Edit
                    </button>
                )}
                
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
                    showCover={true}
                    useMouseEvents={!isEditing && !isFlipping}
                    flippingTime={FLIP_TIMES.USER}
                    startPage={0}
                    onInit={() => startAnimation()}
                >               
                    {pages.map((page, index) => (
                        <div key={index}>
                            <img 
                                src={page.image || `https://placehold.co/400x600?text=Page+${currentPage + 1}`} 
                                alt={`Page ${index + 1}`}
                                className={`${
                                    index === 0 
                                        ? 'rounded-[3px]  rounded-tl-[45%_2%] rounded-bl-[40%_1%] shadow-[1px_0_0_#d1d1d1,2px_0_0_#d4d4d4,3px_0_0_#d7d7d7,4px_0_0_#dadada,0_1px_0_#d1d1d1,0_2px_0_#d4d4d4,0_3px_0_#d7d7d7,0_4px_0_#dadada,0_5px_0_#dadada,0_6px_0_#dadada,4px_6px_0_#dadada,5px_5px_5px_rgba(0,0,0,0.3),8px_8px_7px_rgba(0,0,0,0.35)] relative right-[4px] bottom-[6px]' 
                                        : 'rounded-[3px] rounded-tl-[45%_5%] rounded-bl-[40%_3%] shadow-[5px_5px_5px_rgba(0,0,0,0.3),8px_8px_7px_rgba(0,0,0,0.35),0px_8px_5px_rgba(0,0,0,0.35)]'
                                } mx-auto w-full h-full object-cover`}
                            />
                        </div>
                    ))}
                </HTMLFlipBook>
            </div>

            {renderNavigationButtons()}

            <div className="mt-4 flex justify-center">
                <button 
                    className="bg-green-500 text-white py-2 px-4 rounded-md cursor-pointer mr-4"
                    onClick={handleBackToCreation}
                >
                    Back to Book Creation!
                </button>
            </div>

            <EditPage
                isOpen={isEditing}
                closePopUp={() => dispatch(setIsEditing(false))}
                onSubmit={() => {}}
                initialText=""
                initialImage={getCurrentPageImage()}
            />
        </div>
    );
};

export default ModifyBook;
