import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ModifyBook from "../CreateBook/ModifyBook";
import Loading from '../CreateBook/Loading';
import useCreateBook from '../../Hooks/CreateBook/useCreateBook'; // Import the hook

const CreateBook = () => {
    const { isLoading, hasBookStarted } = useSelector(state => state.book);
    const { createBook } = useCreateBook(); // Use the hook
    const [title, setTitle] = useState('');

    const handleCreateBook = async () => {
        await createBook(title); // Pass the title to the createBook function
    };

    const CreationContainer = (children) => <div className={`${isLoading ? 'pointer-events-none opacity-50' : ''} w-[90vw] mt-[0] ml-[5vw] mr-[5vw]`}>{children}</div>
    
    return <>
        {isLoading && <Loading />}
        {!hasBookStarted ? (
            <div className="flex flex-col items-center justify-center min-h-[100dvh] p-4">
                <h1 className="text-2xl font-bold mb-4">Create Your Book</h1>
                <input 
                    type="text" 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)} 
                    placeholder="Enter book title" 
                    className="mb-4 p-2 border border-gray-300 rounded w-full max-w-sm"
                />
                <button onClick={handleCreateBook} className="bg-blue-500 text-white px-4 py-2 rounded w-full max-w-sm">
                    Start Creating
                </button>
            </div>
        ) : (
            CreationContainer(<ModifyBook />)
        )}
    </>
};

export default CreateBook;
