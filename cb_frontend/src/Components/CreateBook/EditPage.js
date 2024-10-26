import React from 'react';
import { useSelector } from 'react-redux';
import Loading from './Loading';
import useEditPage from '../../Hooks/CreateBook/useEditPage';
import { EditOptions } from '../../constants/editOptions';
import { ChevronLeft } from 'lucide-react'; // Import the X icon

const EditPage = () => {
    const currentPage = useSelector((state) => state.book.currentPage);

    const {
        editText,
        setEditText,
        isVisible,
        isClosing,
        currentImage,
        isLoading,
        handleClose,
        handleSubmit,
        showDescription,
        setShowDescription,
        sceneDescription,
        showEditOptions,
        handleEditOption,
        editMode
    } = useEditPage();

    if ((!isVisible && !isClosing) || currentPage === 0) return null;    

    return (
        <div 
            className={`fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center transition-all duration-300 ease-in-out z-[15] ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            onClick={handleClose} // Close when clicking outside
        >
            <div 
                className={`bg-white p-4 rounded-lg w-full max-w-md transition-all duration-300 ease-in-out ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
            >
               {/*  <button 
                    className="z-[15] absolute top-[1%] right-[2%] text-gray-500 bg-white rounded-full p-1"
                    onClick={handleClose}
                >
                    <ChevronLeft size={30} strokeWidth={2.5} color='grey' /> 
                </button> */}

                {isLoading ? (
                    <Loading description="Generating new image..." />
                ) : (
                    <>
                        <div className="mb-4 relative">
                            {showDescription ? (
                                <div className="w-[90%] mx-[5%] aspect-[2/3] bg-gray-100 rounded p-4 overflow-y-auto">
                                    <p className="text-sm">{sceneDescription}</p>
                                </div>
                            ) : (
                                currentImage && (
                                    <img 
                                        src={currentImage} 
                                        alt="Current Page" 
                                        className="w-[90%] mx-[5%] aspect-[2/3] object-cover rounded"
                                    />
                                )
                            )}
                            <button
                                className="absolute bottom-2 right-[calc(5%+5px)] bg-white bg-opacity-75 text-black text-xs px-2 py-1 rounded-full shadow-md hover:shadow-lg transition-shadow duration-300"
                                onClick={() => setShowDescription(!showDescription)}
                            >
                                {showDescription ? 'See Image' : 'See Description'}
                            </button>
                        </div>
                        {showEditOptions ? (
                            <div className="flex flex-col items-center space-y-4">
                                <div className="w-full flex justify-center space-x-4">
                                    <div className="w-1/2 flex flex-col items-center">
                                        <button 
                                            className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-300"
                                            onClick={() => handleEditOption(EditOptions.MODIFY)}
                                        >
                                            Enhance scene
                                        </button>
                                        <span className="text-xs text-gray-500 mt-1">make character smile, add a tree on the left, ...</span>
                                    </div>
                                    <div className="w-1/2 flex flex-col items-center">
                                        <button 
                                            className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors duration-300"
                                            onClick={() => handleEditOption(EditOptions.START_OVER)}
                                        >
                                            Replace scene
                                        </button>
                                        <span className="text-xs text-gray-500 mt-1">Start fresh with a new scene</span>
                                    </div>
                                </div>
                                <button 
                                    className="w-1/2 px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors duration-300"
                                    onClick={handleClose}
                                >
                                    Cancel
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className="bg-[#87CEFA] p-2 rounded mb-4 text-center">
                                    {editMode === EditOptions.MODIFY ? 'How can we improve this image?' : 'Describe your scene again'}
                                    <textarea 
                                        className="w-full h-32 border border-gray-300 rounded bg-gray-200 mt-2"
                                        value={editText}
                                        onChange={(e) => setEditText(e.target.value)}
                                        placeholder={editMode === EditOptions.MODIFY ? " Make the main character smile more ... \n Add a tree on the left ..." : "Describe your new scene..."}
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
                    </>
                )}
            </div>
        </div>
    );
};

export default EditPage;
