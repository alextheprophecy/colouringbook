import React from 'react';
import HTMLFlipBook from 'react-pageflip';
import EditPage from './EditPage';
import { ChevronRight, ChevronLeft, CirclePlus, Pencil, Plus, Download, FileDown } from 'lucide-react';
import useCreatePage from '../../Hooks/CreateBook/useCreatePage';
import useModifyBook, { FLIP_TIMES } from '../../Hooks/CreateBook/useModifyBook';
import { useCallback, useState } from 'react';
import CreatePage from './CreatePage';


const ModifyBook = () => {

    const MIN_WIDTH = Object.freeze(300);
     // Set minimum width as a constant
    const {
        flipBookRef,
        pages,
        currentPage,
        isFlipping,
        isOnCreationPage,
        startAnimation,
        handlePageNavigation,
        onFlip,
        setIsEditing,
        flipToCreationPage,
        handleFinishBook,
        isFinishing,
        isBookFinished,
    } = useModifyBook();

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
                    className="absolute left-0 top-[50%] transform -translate-y-1/2 -translate-x-1/2 
                              bg-white/80
                              p-2 rounded-full
                              shadow-lg hover:shadow-xl
                              transition-all duration-200
                              ring-1 ring-blue-100
                              group
                              z-10"
                    onClick={handlePageNavigation.previous}
                    disabled={isFlipping}
                >
                    <ChevronLeft 
                        className={`h-8 w-8 
                                  text-blue-600 group-hover:text-blue-800
                                  ${isFlipping ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                    />
                </button>
            )}
            {currentPage < (pages.length - (isBookFinished ? 1 : 0)) && (
                <button 
                    className="absolute -right-0 top-[50%] transform -translate-y-1/2 translate-x-1/2
                              bg-white/80
                              p-2 rounded-full
                              shadow-lg hover:shadow-xl
                              transition-all duration-200
                              ring-1 ring-blue-100
                              group
                              z-10"
                    onClick={handlePageNavigation.next}
                    disabled={isFlipping}
                >
                    <ChevronRight 
                        className={`h-8 w-8 
                                  text-blue-600 group-hover:text-blue-800
                                  ${isFlipping ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                    />
                </button>
            )}
            
            {/* Only show edit button if book is not finished */}
            {!isOnCreationPage() && currentPage > 0 && !isFlipping && !isBookFinished && (
                <button 
                    className={`absolute right-0 bottom-0
                            w-16 h-16
                            bg-white/80
                            shadow-lg hover:shadow-xl
                            rounded-tl-full
                            group
                            overflow-hidden
                            origin-bottom-right
                            ring-1 ring-blue-200
                            z-10`}
                   
                    onClick={() => {console.log('edit');
                        setIsEditing(true)}}
                    disabled={isFlipping}
                >
                    <Pencil 
                        className={`absolute bottom-2 right-2
                                h-8 w-8 
                                text-blue-600 group-hover:text-blue-800
                                cursor-pointer`}
                    />
                </button>
            )}
        </>
    );

    return (
        <div className={`mt-4 p-8 bg-gradient-to-b from-blue-50 to-blue-100 gap-2 rounded-[20px] mx-auto flex justify-end items-stretch flex-col shadow-lg min-w-[${MIN_WIDTH}px] min-h-[600px] max-w-[900px]`}>
            <div className={`flex-1 flex justify-center items-center relative min-w-[${MIN_WIDTH}px]`}>
                {renderNavigationButtons()}
                <HTMLFlipBook
                    key={`book-${pages.length}-${isBookFinished}`}
                    width={300}
                    height={450}    
                    size="stretch"
                    minWidth={MIN_WIDTH}
                    maxWidth={1000}
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
                    onInit={() => startAnimation(pages.length-1)}  // For initial animation
                >
                    {[
                        ...pages.map((page, index) => (
                            <div key={index} className="page-element">
                                <img 
                                    src={page.image || `https://placehold.co/400x600?text=Page+${index + 1}`} 
                                    alt={`Page ${index + 1}`}
                                    className={pageClassname(index)}
                                />
                            </div>
                        )),
                        !isBookFinished ? (
                            <CreatePage key="create-page" classNameProp={pageClassname(1)} />
                        ) : null
                    ].filter(Boolean)}

                </HTMLFlipBook>
            </div>

            <div className="mt-[10px] flex flex-col gap-4 items-center">
                {/* Only show New Page button if book is not finished */}
                {!isBookFinished && (
                    <button 
                        className={`w-full max-w-md 
                            ${isOnCreationPage() ? 'opacity-0 pointer-events-none' : 'opacity-100 relative'} 
                            ${isFlipping ? 'cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'}
                            text-white py-3 px-6 rounded-lg 
                            transition-opacity duration-300 ease-in-out 
                            hover:scale-[1.02] shadow-md hover:shadow-lg
                            flex items-center justify-center gap-2
                            font-children font-semibold tracking-wider`}
                        onClick={flipToCreationPage}
                        disabled={isOnCreationPage() || isFlipping}
                    >
                        <Plus className="w-5 h-5" />
                        New page
                    </button>
                )}

                <button 
                    className={`w-full max-w-md 
                        ${isBookFinished ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-500 hover:bg-blue-600'}
                        ${isOnCreationPage() && !isBookFinished ? 'opacity-100 -translate-y-4 scale-110' : 'opacity-70 translate-y-0 scale-100'}
                        ${isFinishing ? 'cursor-not-allowed' : ''}
                        text-white py-3 px-6 rounded-lg 
                        transition-all duration-300 ease-in-out 
                        hover:scale-[1.02] shadow-md hover:shadow-lg
                        font-children font-semibold tracking-wider
                        flex items-center justify-center gap-2`}
                    onClick={handleFinishBook}
                    disabled={isFinishing}
                >
                    {isFinishing ? (
                        <div className="flex items-center gap-2">
                            <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin" />
                            Processing...
                        </div>
                    ) : (
                        <>
                            {isBookFinished ? (
                                <>
                                    <FileDown className="w-5 h-5" />
                                    Download PDF
                                </>
                            ) : (
                                <>
                                    <Download className="w-5 h-5" />
                                    Finish Book
                                </>
                            )}
                        </>
                    )}
                </button>
            </div>

            {/* Only render EditPage if book is not finished */}
            {!isBookFinished && <EditPage />}
        </div>
    );
};

export default ModifyBook;
