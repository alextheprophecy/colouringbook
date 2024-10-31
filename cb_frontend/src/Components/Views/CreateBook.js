import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ModifyBook from "../CreateBook/ModifyBook";
import Loading from '../CreateBook/Loading';
import useCreateBook from '../../Hooks/CreateBook/useCreateBook';

const CreateBook = () => {
    const { isLoading, hasBookStarted } = useSelector(state => state.book);
    const credits = useSelector(state => state.website.credits);
    const { createBook } = useCreateBook();
    const [title, setTitle] = useState('');

    const handleCreateBook = async () => {
        await createBook(title);
    };

    const CreationContainer = (children) => (
        <div className={`${isLoading ? 'pointer-events-none opacity-50' : ''} w-[90vw] mt-[0] ml-[5vw] mr-[5vw]`}>
            {children}
        </div>
    );
    
    return <>
        {isLoading && <Loading />}
        {!hasBookStarted ? (
            <div className="flex flex-col items-center justify-center min-h-[100dvh] p-4">
                <div className="max-w-sm w-full bg-white p-6 rounded-lg shadow-lg">
                    <h1 className="text-2xl font-bold mb-4 text-center">Create Your Book</h1>
                    <div className="text-center mb-4">
                        <div className={`inline-block px-2 py-1 rounded-full 
                            ${credits > 0 ? 'bg-green-100/80' : 'bg-red-100/80'} 
                            shadow-sm 
                            backdrop-blur-sm
                            font-mono text-sm
                            transition-all duration-200`}
                        >
                            {credits > 0 ? (
                                <span className="text-green-700">
                                    {credits} credits remaining
                                </span>
                            ) : (
                                <span className="text-red-600">Out of credits!</span>
                            )}
                        </div>
                    </div>
                    <input 
                        type="text" 
                        value={title} 
                        onChange={(e) => setTitle(e.target.value)} 
                        placeholder="Enter book title" 
                        className="mb-4 p-2 border border-gray-300 rounded w-full"
                    />
                    <button 
                        onClick={handleCreateBook} 
                        disabled={credits < 3}
                        className={`w-full py-2 px-4 rounded font-semibold
                            ${credits >= 3 
                                ? 'bg-blue-500 hover:bg-blue-600 text-white' 
                                : 'bg-gray-300 cursor-not-allowed text-gray-500'}
                            transition-colors duration-200`}
                    >
                        {credits >= 3 ? 'Start Creating' : 'Not Enough Credits'}
                    </button>
                </div>
            </div>
        ) : (
            CreationContainer(<ModifyBook />)
        )}
    </>;
};

export default CreateBook;
