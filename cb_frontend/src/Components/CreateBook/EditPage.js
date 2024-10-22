import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Loading from './Loading';
import { updatePage, setIsEditing } from '../../redux/bookSlice';

const EditPage = () => {
    const dispatch = useDispatch();
    const { pages, currentPage, isEditing } = useSelector(state => state.book);
    const [editText, setEditText] = useState('');
    const [isVisible, setIsVisible] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const [currentImage, setCurrentImage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isEditing && !isClosing) {
            setEditText(pages[currentPage]?.description || '');
            setCurrentImage(pages[currentPage]?.image || '');
            setTimeout(() => setIsVisible(true), 50);
        } else if (!isEditing && !isClosing) {
            handleClose();
        }
    }, [isEditing, currentPage, pages]);

    const handleClose = useCallback(() => {
        if (!isClosing) {
            setIsClosing(true);
            setIsVisible(false);
            setTimeout(() => {
                dispatch(setIsEditing(false));
                setIsClosing(false);
            }, 300);
        }
    }, [dispatch]);

    const handleSubmit = useCallback(async () => {
        if (editText.trim() !== '') {
            setIsLoading(true);
            try {
                // Replace this with your actual API call
                const response = await new Promise(resolve => 
                    setTimeout(() => resolve({ newImage: 'path/to/new/image.jpg' }), 3000)
                );
                
                dispatch(updatePage({ 
                    index: currentPage, 
                    data: { 
                        image: response.newImage, 
                        description: editText 
                    } 
                }));
                dispatch(setIsEditing(false));
            } catch (error) {
                console.error('Error generating image:', error);
                // Handle error (e.g., show error message to user)
            } finally {
                setIsLoading(false);
            }
        }
    }, [editText, currentPage, dispatch]);

    if (!isEditing && !isClosing) return null;

    return (
        <div className={`fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center transition-opacity duration-300 z-[15] ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            <div className={`bg-white p-4 rounded-lg w-full max-w-md transition-transform duration-300 ease-out ${isVisible ? 'translate-y-0' : 'translate-y-full'}`}>   
                {isLoading ? (
                    <Loading description="Generating new image..." />
                ) : (
                    <>
                        {currentImage && (
                            <div className="mb-4">
                                <img 
                                    src={currentImage} 
                                    alt="Current Page" 
                                    className="w-[90%] mx-[5%] aspect-preserve object-cover rounded"
                                />
                            </div>
                        )}
                        <div className="bg-[#87CEFA] p-2 rounded mb-4 text-center">
                            What do you want to change?                
                            <textarea 
                                className="w-full h-32 border border-gray-300 rounded bg-gray-200"
                                value={editText}
                                onChange={(e) => setEditText(e.target.value)}
                                placeholder="Make the main character smile more..."
                            />
                        </div>
                        <div className="flex justify-end">
                            <button 
                                className="mr-2 px-4 py-2 bg-gray-200 rounded"
                                onClick={handleClose}
                            >
                                Cancel
                            </button>
                            <button 
                                className={`px-4 py-2 rounded ${editText.trim() !== '' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-400 cursor-not-allowed'}`}
                                onClick={handleSubmit}
                                disabled={editText.trim() === ''}
                            >
                                Save
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default EditPage;
