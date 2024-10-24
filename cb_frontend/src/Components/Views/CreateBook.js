import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import CreatePage from "../CreateBook/CreatePage";
import PagePreview from "../CreateBook/PagePreview";
import ModifyBook from "../CreateBook/ModifyBook";
import EditPage from "../CreateBook/EditPage";
import { setCurrentPage, setIsModifyingBook } from '../../redux/bookSlice';

const CreateBook = () => {
    const dispatch = useDispatch();
    const { pages, currentPage, isModifyingBook, isEditing } = useSelector(state => state.book);

    const handleNext = () => {
        if (currentPage < pages.length - 1) dispatch(setCurrentPage(currentPage + 1));
        else dispatch(setCurrentPage(pages.length));        
    };

    const handleModifyBook = () => dispatch(setIsModifyingBook(true));

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

    return CreationContainer(
            <>
                {currentPage === pages.length ? (
                    <CreatePage 
                        explainText={`Add description for page ${currentPage + 1}`}
                    />
                ) : (
                    <PagePreview
                        pageNumber={currentPage + 1}
                        imageSrc={imageSrc}
                        onNext={handleNext}
                        onModifyBook={handleModifyBook}
                    />
                )}
                {isEditing && <EditPage />}
            </>
        )
        
    
};

export default CreateBook;
