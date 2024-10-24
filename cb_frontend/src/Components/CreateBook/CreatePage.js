import React from 'react';
import { useDispatch } from 'react-redux';
import useCreatePage from '../../Hooks/CreateBook/useCreatePage';
import { setIsModifyingBook } from '../../redux/bookSlice';

const CreatePage = ({ explainText }) => {  
    const dispatch = useDispatch();
    const {
        description,
        handleDescriptionChange,
        createImage
    } = useCreatePage();

    return (
        <div className="p-4 bg-blue-100 rounded-[15px]">   
            {explainText}
            <textarea
                value={description}
                onChange={handleDescriptionChange}
                placeholder="Write a description"
                className="w-full border border-black h-24 rounded-[5px]"
            />

            <button
                onClick={createImage}
                className={`mt-2 p-2 rounded mx-auto block ${
                    description.trim() !== '' 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-gray-300 text-gray-400 cursor-not-allowed'
                }`}
                disabled={description.trim() === ''}
            >
                Submit
            </button>
        </div>
    );
};

export default CreatePage;
