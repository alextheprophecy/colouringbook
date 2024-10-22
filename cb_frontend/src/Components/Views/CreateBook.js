import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import CreatePage from "../CreateBook/CreatePage";
import PagePreview from "../CreateBook/PagePreview";
import ModifyBook from "../CreateBook/ModifyBook";
import EditPage from "../CreateBook/EditPage";
import { setCurrentPage, setIsEditing, setIsModifyingBook } from '../../redux/bookSlice';

const CreateBook = () => {
    const dispatch = useDispatch();
    const { pages, currentPage, isEditing, isModifyingBook } = useSelector(state => state.book);

    const handleNext = () => {
        if (currentPage < pages.length - 1) {
            dispatch(setCurrentPage(currentPage + 1));
        } else {
            dispatch(setCurrentPage(pages.length));
        }
    };

    const handleModifyBook = () => {
        dispatch(setIsModifyingBook(true));
    };

    const getCurrentPageData = () => {
        if (pages[currentPage]) {
            return {
                imageSrc: pages[currentPage].image,
                description: pages[currentPage].description
            };
        }
        return { imageSrc: null, description: '' };
    };

    if (isModifyingBook) {
        return <ModifyBook />;
    }

    const { imageSrc, description } = getCurrentPageData();

    return (
        <div className="w-[90vw] mt-[10vh] ml-[5vw] mr-[5vw] bg-white">
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
            <EditPage />
        </div>
    );
};

export default CreateBook;
