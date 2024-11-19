import React from 'react';
import HTMLFlipBook from 'react-pageflip';
import EditPage from './EditPage';
import { ChevronRight, ChevronLeft, Pencil, Plus, Download, FileDown, BookOpen, BookCheck, Trash2 } from 'lucide-react';
import useModifyBook, { FLIP_TIMES } from '../../Hooks/CreateBook/useModifyBook';
import {useState, useCallback } from 'react';
import CreatePage from './CreatePage';
import { useSelector, useDispatch } from 'react-redux';
import { toggleSetting } from '../../redux/websiteSlice';
import { useTranslation } from 'react-i18next';
import { setCurrentPage, setIsEditing, finishBook, editPage, creatingPage, resetBook } from '../../redux/bookSlice';
import EditButton from './UI/EditButton';
import useLoadRequest from '../../Hooks/CreateBook/useLoadRequest';
import { resetPersistedState } from '../../redux/store';
import ImageQualityOptions from './UI/ImageQualityOptions';
import DeleteButton from './UI/DeleteButton';


const ModifyBook = () => {
    const { t } = useTranslation();
    const MIN_WIDTH = Object.freeze(200);
    const { loadRequest } = useLoadRequest();
    const { isLoading } = useSelector((state) => state.website);

    // Add test function for loading
    const testLoading = async () => {
        await loadRequest(
            () => new Promise(resolve => setTimeout(resolve, 2500)), // 3 second delay
            "Testing loading state...",
            true
        );
    };

    // Add test button at the top
    const TestButton = () => (
        <button
            onClick={testLoading}
            className="fixed top-16 right-2 z-10 px-3 py-1.5 bg-red-500 hover:bg-red-600 
                      text-white rounded-lg shadow-md hover:shadow-lg 
                      transition-all duration-200 font-children text-sm"
        >
            Test Loading
        </button>
    );

    const {
        flipBookRef,
        pages,
        currentPage,
        isFlipping,
        isOnCreationPage,
        startAnimation,
        handlePageNavigation,
        onFlip,
        flipToCreationPage,
        handleFinishBook,
        isFinishing,
        isBookFinished,
        isSinglePage,
        handleCreatePageMouseEnter,
        handleCreatePageMouseLeave,
        updateOrientation
    } = useModifyBook();

    const {workingOnPage} = useSelector((state) => state.book)
    const credits = useSelector((state) => state.website.credits);
    const settings = useSelector((state) => state.website.settings);
    const [showAdvanced, setShowAdvanced] = useState(false);
    const dispatch = useDispatch();   

    const pageClassname = (index) => {
        return `${index === 0 
            ? 'rounded-[3px] rounded-tl-[45%_3%] rounded-br-[45%_1%] shadow-[1px_0_0_#d1d1d1,2px_0_0_#d4d4d4,3px_0_0_#d7d7d7,4px_0_0_#dadada,0_1px_0_#d1d1d1,0_2px_0_#d4d4d4,0_3px_0_#d7d7d7,0_4px_0_#dadada,0_5px_0_#dadada,0_6px_0_#dadada,4px_6px_0_#dadada,5px_5px_5px_rgba(0,0,0,0.3),8px_8px_7px_rgba(0,0,0,0.35)] relative right-[4px] bottom-[6px]' 
            : (isSinglePage || index%2===1) ? ('rounded-[3px] rounded-tl-[45%_5%] rounded-bl-[40%_3%] shadow-[5px_5px_5px_rgba(0,0,0,0.3),8px_8px_7px_rgba(0,0,0,0.35),0px_8px_5px_rgba(0,0,0,0.35)]')
            : ('rounded-[3px] rounded-tr-[45%_5%] rounded-br-[40%_3%] shadow-[5px_5px_5px_rgba(0,0,0,0.3),8px_8px_7px_rgba(0,0,0,0.35),0px_8px_5px_rgba(0,0,0,0.35)]')
        } mx-auto w-full h-full object-cover`;
    };        

    const renderNavigationButtons = () => (
        <>
            {currentPage > 0 && (
                <button 
                    className="absolute left-16 top-[50%] transform -translate-y-1/2 -translate-x-1/2 
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
                    className="absolute right-16 top-[50%] transform -translate-y-1/2 translate-x-1/2
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
            {/* Edit buttons - show one or two depending on isSinglePage */}
            {currentPage > 0 && !isFlipping && !isLoading && !isBookFinished && (
                <>
                    {/* Left page edit button */}
                    {(!isSinglePage && currentPage > 1 && (currentPage != pages.length+1)) && (
                        <EditButton 
                            position="left"
                            onClick={() => dispatch(editPage(currentPage-1))}
                            disabled={isFlipping}
                        />
                    )}

                    {/* Right page edit button */}
                    {!isOnCreationPage() && (
                        <EditButton 
                            position="right"
                            onClick={() => dispatch(editPage(currentPage))}
                            disabled={isFlipping}
                        />
                    )}
                </>
            )}
        </>
    );   

    const pageLoadingBlur = () =>
        <div className={`absolute inset-0 bg-white/70 backdrop-blur-[2px]
            flex items-center justify-center z-10 rounded-[inherit]`}>
            <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent 
                    rounded-full animate-spin" />
                <p className="text-blue-600 font-children text-lg font-semibold">
                    {t('modifybook.modifying')}
                </p>
            </div>
        </div>
    

    return (
        <div className={`mt-12 p-4 gap-2 rounded-lg mx-auto flex
            items-stretch flex-col min-w-[${MIN_WIDTH}px] min-h-[600px] max-w-[900px]`}>
            {/* Credits display at the top */}
           
            <div className=" fixed top-2 right-2 z-10">
                <div className={`px-2 py-1 rounded-lg 
                    ${credits > 0 ? 'bg-green-400/60' : 'bg-red-400/60'} 
                    shadow-sm 
                    backdrop-blur-sm
                    font-mono text-sm
                    transition-all duration-200`}
                >
                    <span className="text-white">
                        {credits > 0 ? `${credits} credits` : t('modifybook.credits.out_of_credits')}
                    </span>                    
                </div>
            </div>
            {/* Book container*/}
            <div className={`flex-1 justify-center items-center  relative min-w-[${MIN_WIDTH}px] overflow-hidden p-16 -mx-16 -my-16`}>
                {renderNavigationButtons()}
                <HTMLFlipBook
                    key={`book-${pages.length}-${isLoading}-${isBookFinished}-${isFinishing}`}
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
                    onInit={() => {
                        updateOrientation();
                        if(isFinishing)startAnimation(0, true);
                        if(pages.length===1)return startAnimation(1)
                        const goToPage = workingOnPage===-1?(pages.length-1):(workingOnPage)
                        if(!isLoading)startAnimation(goToPage)
                            //LETS MOVE ALL THIS LOGIC INSIDE THE STARTANIMATION FUNCTION
                    }}  // For initial animation
                >
                    {[
                        ...pages.map((page, index) => [
                            <div key={`page-${index}`} className="page-element">
                                {(page.image.startsWith('http') || page.image.startsWith('blob')) ? (
                                    <div className={`${pageClassname(index)} overflow-hidden `}>
                                        <img 
                                            src={page.image} 
                                            alt={`{t('creation.page')} ${index + 1}`}
                                            className="h-full w-full object-cover bg-gray-200"
                                        />
                                        {isLoading && workingOnPage === index && pageLoadingBlur()}
                                    </div>
                                ) : (
                                    <div className={`${pageClassname(index)} bg-white p-6 font-children text-gray-700 overflow-y-auto`}>
                                        <p className="whitespace-pre-wrap">{page.image}</p>
                                        {isLoading && workingOnPage === index && pageLoadingBlur()}
                                    </div>
                                )}
                            </div>,
                            // Add blank page after cover (index 0)
                            !isSinglePage && index === 0 && (
                                <div key="blank-after-cover" className="page-element">
                                    <div className={`${pageClassname(2)} bg-blue-300`}></div>
                                </div>
                            )
                        ]).flat(),
                        !(isBookFinished || isFinishing) ? (
                            <CreatePage 
                                key="create-page" 
                                disabled={(isLoading && workingOnPage!==-1) || credits<=0}
                                classNameProp={pageClassname(pages.length)}
                                onMouseEnter={handleCreatePageMouseEnter}
                                onMouseLeave={handleCreatePageMouseLeave}
                            />
                        ) : null,
                        (!isSinglePage && pages.length%2===0) ? <div className={`${pageClassname(1)} bg-[#93C5FD]`}/> : null
                    ].filter(Boolean)}

                </HTMLFlipBook>
            </div>

            {/* Buttons container with absolute scaling */}
            <div className={`flex mt-4 flex-col gap-4 items-center transition-scale transition-opacity duration-500 ease-in-out
                ${isLoading ? 'scale-0 opacity-0 absolute' : 'scale-100 opacity-100 relative'}`}>
                {/* Only show New Page button if book is not finished */}
                {!isBookFinished && (
                    <>
                    <button key={`new-page-button-${isOnCreationPage()}`}
                        className={`w-full max-w-md 
                            ${isOnCreationPage() ? 'scale-0 absolute pointer-events-none' : 'scale-100 relative'}
                            bg-blue-500 hover:bg-blue-600 
                            text-white py-3 px-6 rounded-lg 
                            transition-scale duration-300 ease-in-out 
                            hover:scale-[1.02] shadow-md hover:shadow-lg
                            flex items-center justify-center gap-2
                            font-children font-semibold tracking-wider`}
                        onClick={flipToCreationPage}
                        disabled={isOnCreationPage() || isFlipping}
                    >
                        <Plus className="w-5 h-5" />
                        {t('creation.new-page')}
                    </button>
                    <ImageQualityOptions isVisible={isOnCreationPage()} />
                    
                    </>
                )}

                <button 
                    className={`w-full max-w-md
                        ${!isBookFinished ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-600 hover:bg-blue-600'}
                        
                        ${''/* isOnCreationPage() && !isBookFinished ? '' : '-mt-16' */}
                        ${isFinishing ? 'cursor-not-allowed' : ''}
                        ${pages.length <= 1 ? 'hidden' : ''}
                        text-white py-3 px-6 rounded-lg 
                        transition-all duration-300 ease-in-out 
                        hover:scale-[1.02] shadow-md hover:shadow-lg
                        font-children font-semibold tracking-wider
                        flex items-center justify-center gap-2`}
                    onClick={handleFinishBook}
                    disabled={isFinishing || pages.length <= 1}
                >
                    {isFinishing ? (
                        <div className="flex items-center gap-2">
                            <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin" />
                            {t('modifybook.processing')}
                        </div>
                    ) : (
                        <>
                            {isBookFinished ? (
                                <>
                                    <FileDown className="w-5 h-5" />
                                    {t('modifybook.download_pdf')}
                                </>
                            ) : (
                                <>
                                    <BookCheck className="w-5 h-5" />
                                    {t('modifybook.finish_book')}
                                </>
                            )}
                        </>
                    )}
                </button>

                {isBookFinished && (
                    <div className="flex flex-col gap-3 w-full max-w-md">
                        <button 
                            onClick={() => {dispatch(resetBook())}}
                            className="w-full bg-blue-500 hover:bg-blue-600 
                                text-white py-3 px-6 rounded-lg 
                                transition-all duration-300 ease-in-out 
                                hover:scale-[1.02] shadow-md hover:shadow-lg
                                font-children font-semibold tracking-wider
                                flex items-center justify-center gap-2"
                        >
                            <Plus className="w-5 h-5" />
                            {t('creation.new-book')}
                        </button>
                        
                        <a 
                            href="/gallery"
                            className="w-full bg-purple-500 hover:bg-purple-600 
                                text-white py-3 px-6 rounded-lg 
                                transition-all duration-300 ease-in-out 
                                hover:scale-[1.02] shadow-md hover:shadow-lg
                                font-children font-semibold tracking-wider
                                flex items-center justify-center gap-2"
                        >
                            <BookOpen className="w-5 h-5" />
                            {t('login.my-gallery')}
                        </a>
                    </div>)}       

                {/* Settings Panel */}
                {!isBookFinished && (<div className="w-full max-w-md flex flex-col gap-4">
                  

                    {/* Advanced Options Dropdown */}
                    <div className="flex flex-col gap-2">
                        <button 
                            onClick={() => setShowAdvanced(prev => !prev)}
                            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800 transition-colors duration-200 px-2"
                        >
                            <ChevronRight className={`w-4 h-4 transition-transform duration-200 ${showAdvanced ? 'rotate-90' : ''}`} />
                            {t('modifybook.advanced_options')}
                        </button>
                        
                        <div className={`flex flex-col gap-2 overflow-hidden transition-all duration-200 ${showAdvanced ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                            {/* Test Mode Toggle */}
                            <div className="p-4 bg-white/80 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 ring-1 ring-blue-100">
                                <label className="flex items-center justify-between cursor-pointer">
                                    <div className="flex flex-col">
                                        <span className="text-lg font-children font-semibold text-gray-700">{t('modifybook.test_mode')}</span>
                                        <span className="text-sm text-gray-500">{t('modifybook.test_mode_description')}</span>
                                    </div>
                                    <div className="relative">
                                        <input
                                            type="checkbox"
                                            checked={settings.testMode}
                                            onChange={() => dispatch(toggleSetting('testMode'))}
                                            className="sr-only"
                                        />
                                        <div className={`block w-14 h-8 rounded-full transition-colors duration-200 ease-in-out ${settings.testMode ? 'bg-red-500' : 'bg-gray-300'}`}>
                                            <div className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform duration-200 ease-in-out ${settings.testMode ? 'transform translate-x-6' : ''}`}></div>
                                        </div>
                                    </div>
                                </label>
                            </div>

                            {/* Advanced Context Toggle */}
                            <div className="p-4 bg-white/80 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 ring-1 ring-blue-100">
                                <label className="flex items-center justify-between cursor-pointer">
                                    <div className="flex flex-col">
                                        <span className="text-lg font-children font-semibold text-gray-700">{t('modification.advanced-story-context')}</span>
                                        <span className="text-sm text-gray-500">{t('modification.use-more-detailed-story-context-for-better-continuity')}</span>
                                    </div>
                                    <div className="relative">
                                        <input
                                            type="checkbox"
                                            checked={settings.useAdvancedContext}
                                            onChange={() => dispatch(toggleSetting('useAdvancedContext'))}
                                            className="sr-only"
                                        />
                                        <div className={`block w-14 h-8 rounded-full transition-colors duration-200 ease-in-out ${settings.useAdvancedContext ? 'bg-blue-500' : 'bg-gray-300'}`}>
                                            <div className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform duration-200 ease-in-out ${settings.useAdvancedContext ? 'transform translate-x-6' : ''}`}></div>
                                        </div>
                                    </div>
                                </label>
                            </div>
                        </div>
                    </div>
                    
                    {/* Use the new DeleteButton component */}
                    <DeleteButton />
                </div>)}
            </div>

            {/* Only render EditPage if book is not finished */}
            {!isBookFinished && <EditPage />}
        </div>
    );
};

export default ModifyBook;
