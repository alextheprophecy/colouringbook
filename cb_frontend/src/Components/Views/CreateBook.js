import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import CreatePage from "../CreateBook/CreatePage";
import PagePreview from "../CreateBook/PagePreview";
import ModifyBook from "../CreateBook/ModifyBook";
import EditPage from "../CreateBook/EditPage";
import Loading from '../CreateBook/Loading';

import { setCurrentPage, setIsModifyingBook } from '../../redux/bookSlice';

const CreateBook = () => {
    const dispatch = useDispatch();
    const { pages, currentPage, isModifyingBook, isEditing, isLoading } = useSelector(state => state.book);

    const handleNext = () => {
        if (currentPage < pages.length - 1) dispatch(setCurrentPage(currentPage + 1));
        else dispatch(setCurrentPage(pages.length));        
    };

    const getCurrentPageData = () =>
       pages[currentPage] ?
            {
                imageSrc: pages[currentPage].image,
                description: pages[currentPage].description
            } :
            { imageSrc: null, description: '' }    


    const CreationContainer = (children) => <div className="w-[90vw] mt-[10vh] ml-[5vw] mr-[5vw] bg-white">{children}</div>

    const { imageSrc, description } = getCurrentPageData()
    
    if (isModifyingBook) return CreationContainer(<ModifyBook />)

    return (
        <div className="w-[90vw] mt-[10vh] ml-[5vw] mr-[5vw] bg-white">
            <button 
                className="w-full max-w-md bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold transition-all transform hover:scale-105 shadow-md hover:shadow-lg mb-4"
                onClick={() => dispatch(setIsModifyingBook(true))}
            >
                View Book
            </button>
            {isLoading ? (
                <Loading />
            ) : (
                <>
                    {currentPage === pages.length ? (
                        <CreatePage 
                            explainText={`New Page (p.${currentPage})`}
                        />
                    ) : (
                        <PagePreview
                            pageNumber={currentPage + 1}
                            imageSrc={imageSrc}
                            onNext={handleNext}
                        />
                    )}
                    {isEditing && <EditPage />}
                    {/* <button 
                        className="mt-4 p-2 bg-blue-500 text-white rounded" 
                        onClick={handleLogBookData}
                    >
                        Log Book Data
                    </button> */}
                </>
            )}
        </div>
    );
};

export default CreateBook;
