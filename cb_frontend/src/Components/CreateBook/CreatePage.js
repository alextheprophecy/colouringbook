import React, { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import Loading from './Loading';
import { addPage, setIsModifyingBook } from '../../redux/bookSlice';

const CreatePage = ({ explainText }) => {  
    const dispatch = useDispatch();
    const [description, setDescription] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleDescriptionChange = (event) => setDescription(event.target.value);

    const handleSubmit = useCallback(async () => {
        if (description.trim() !== '') {
            setIsLoading(true);
            try {
                // Replace this with your actual API call
                const response = await new Promise(resolve => 
                    setTimeout(() => resolve({ newImage: 'path/to/new/image.jpg' }), 3000)
                );
                
                dispatch(addPage({ image: response.newImage, description }));
            } catch (error) {
                console.error('Error generating image:', error);
                // Handle error (e.g., show error message to user)
            } finally {
                setIsLoading(false);
            }
        }
    }, [description, dispatch]);

    return (
        <div className="p-4 bg-blue-100 rounded-[15px]">   
            {explainText}
            {isLoading ? (
                <Loading description="Generating new image..." />
            ) : (
                <>
                    <textarea
                        value={description}
                        onChange={handleDescriptionChange}
                        placeholder="Write a description"
                        className="w-full border border-black h-24 rounded-[5px]"
                    />
                    <button onClick={() => dispatch(setIsModifyingBook(true))} className="p-2 bg-red-500 text-white rounded">Modify Book</button>

                    <button
                        onClick={handleSubmit}
                        className={`mt-2 p-2 rounded mx-auto block ${
                            description.trim() !== '' 
                                ? 'bg-blue-500 text-white' 
                                : 'bg-gray-300 text-gray-400 cursor-not-allowed'
                        }`}
                        disabled={description.trim() === ''}
                    >
                        Submit
                    </button>
                </>
            )}
        </div>
    );
};

export default CreatePage;
