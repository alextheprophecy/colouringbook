import React from 'react';
import HTMLFlipBook from 'react-pageflip';
import EditPage from './EditPage';
import { ChevronRight, ChevronLeft, CirclePlus } from 'lucide-react';
import useCreatePage from '../../Hooks/CreateBook/useCreatePage';
import useModifyBook, { FLIP_TIMES } from '../../Hooks/CreateBook/useModifyBook';

const ModifyBook = () => {
    const {
        flipBookRef,
        pages,
        currentPage,
        isEditing,
        isModifyingBook,
        isFlipping,
        isOnCreationPage,
        startAnimation,
        handlePageNavigation,
        onFlip,
        toggleModifyingBook,
        setIsEditing,
        getCurrentPageImage,
        flipToCreationPage
    } = useModifyBook();

    const { createImage } = useCreatePage();

    const pageClassname = (index) => {
        return `${index === 0 
            ? 'rounded-[3px] rounded-tl-[45%_3%] rounded-br-[45%_1%] shadow-[1px_0_0_#d1d1d1,2px_0_0_#d4d4d4,3px_0_0_#d7d7d7,4px_0_0_#dadada,0_1px_0_#d1d1d1,0_2px_0_#d4d4d4,0_3px_0_#d7d7d7,0_4px_0_#dadada,0_5px_0_#dadada,0_6px_0_#dadada,4px_6px_0_#dadada,5px_5px_5px_rgba(0,0,0,0.3),8px_8px_7px_rgba(0,0,0,0.35)] relative right-[4px] bottom-[6px]' 
            : 'rounded-[3px] rounded-tl-[45%_5%] rounded-bl-[40%_3%] shadow-[5px_5px_5px_rgba(0,0,0,0.3),8px_8px_7px_rgba(0,0,0,0.35),0px_8px_5px_rgba(0,0,0,0.35)]'
        } mx-auto w-full h-full object-cover`;
    };

    const renderNavigationButtons = () => (
        <>
            {currentPage > 0 && (
                <button 
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 text-[#87CEFA] hover:text-blue-400 transition-colors z-10"
                    onClick={handlePageNavigation.previous}
                    disabled={isFlipping}
                >
                    <ChevronLeft 
                        className={`h-12 w-12 ${isFlipping ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                    />
                </button>
            )}
            {currentPage < pages.length && !isOnCreationPage() && (
                <button 
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-[#87CEFA] hover:text-blue-400 transition-colors z-10"
                    onClick={handlePageNavigation.next}
                    disabled={isFlipping}
                >
                    <ChevronRight 
                        className={`h-12 w-12 ${isFlipping ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                    />
                </button>
            )}
        </>
    );

    return (
            <div className="p-8 bg-gradient-to-b from-blue-50 to-blue-100 rounded-[20px] max-w-[900px] mx-auto relative min-h-[600px] shadow-lg">
                {renderNavigationButtons()}

                <div className="flex justify-center items-center relative">
                    <HTMLFlipBook
                        key={pages.length} // Force re-initialization when pages change
                        width={300}
                        height={450}    
                        size="stretch"
                        minWidth={315}
                        maxWidth={1000}
                        minHeight={400}
                        maxHeight={1533}
                        maxShadowOpacity={0.5}
                        mobileScrollSupport={true}
                        clickEventForward={true}
                        ref={flipBookRef}
                        onFlip={onFlip}
                        className="demo-book"
                        showCover={true}
                        flippingTime={FLIP_TIMES.USER}
                        startPage={currentPage}
                        onInit={() => startAnimation(pages.length - 1)}  // For initial animation
                    >
                        {pages.map((page, index) => (
                            <div key={index} className="page-element">
                                <img 
                                    src={page.image || `https://placehold.co/400x600?text=Page+${index + 1}`} 
                                    alt={`Page ${index + 1}`}
                                    className={pageClassname(index)}
                                />
                            </div>
                        ))}                  
                        <div className={`bg-[#f1e6cf] ${pageClassname(1)} flex items-center justify-center page-element`}>
                        
                        <div style={{ pointerEvents: 'none' }}>
                            <textarea
                                className="w-full h-32 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Write something..."
                                style={{ pointerEvents: 'auto' }} // Allow the textarea to receive pointer events
                            />
                            <CirclePlus 
                                className="w-16 h-16 text-black hover:text-gray-700 cursor-pointer transition-colors absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                                onClick={createImage}
                            />
                          
                        </div>
                        </div>

                    </HTMLFlipBook>                   
                </div>

                <div className="mt-8 flex flex-col gap-4 items-center">
                    {pages.length > 0 && (
                        <button 
                            className={`w-full max-w-md  text-white ${
                                currentPage === 0 ? 'opacity-50 bg-gray-300 cursor-not-allowed' : 'bg-[#87CEFA] hover:bg-blue-400'
                            } py-3 px-6 rounded-lg font-semibold transition-all transform hover:scale-102 ${
                                isFlipping ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer shadow-md hover:shadow-lg'
                            }`}
                            onClick={toggleModifyingBook}
                            disabled={isFlipping || currentPage === 0}
                        >
                            {currentPage===0? 'Book Cover' : `Edit page ${currentPage}`}
                        </button>
                    )}
                    
                    <button 
                        className={`w-full max-w-md ${
                            isOnCreationPage()
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-green-500 hover:bg-green-600'
                        } text-white py-3 px-6 rounded-lg font-semibold transition-all transform hover:scale-102 shadow-md hover:shadow-lg`}
                        onClick={flipToCreationPage}
                        disabled={isOnCreationPage() || isFlipping}
                    >
                        Continue Creating
                    </button>
                </div>

                <EditPage
                    isOpen={isEditing}
                    closePopUp={() => setIsEditing(false)}
                    onSubmit={() => {}}
                    initialText=""
                    initialImage={getCurrentPageImage()}
                />
            </div>
    );
};

export default ModifyBook;
