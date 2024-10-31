import React from 'react';
import { useSelector } from 'react-redux';
import Loading from './Loading';
import useEditPage from '../../Hooks/CreateBook/useEditPage';
import {Wand2, RotateCcw, Info } from 'lucide-react'; // Add Info to the imports

const EditPage = () => {
    const currentPage = useSelector((state) => state.book.currentPage);
    const settings = useSelector((state) => state.website.settings);

    const {
        editText,
        setEditText,
        isVisible,
        currentImage,
        isLoading,
        handleClose,
        showDescription,
        setShowDescription,
        sceneDescription,
        isEnhancing,
        setIsEnhancing,
        handleRegenerate,
        handleEnhance
    } = useEditPage();

    if (!isVisible || currentPage === 0) return null;    

    return ( 
        <div 
            className={`fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center transition-all duration-300 ease-in-out z-[15] ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            onClick={handleClose} // Close when clicking outside
        >
            <div 
                className={`bg-white p-4 rounded-lg w-full max-w-md transition-all duration-300 ease-in-out ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
            >                
                <>
                    <div className="mb-4 relative max-h-[50vh]">
                        {showDescription ? (
                            <div className="max-h-[50vh] min-h-[300px] mx-[auto] bg-gray-100 rounded p-4 overflow-y-auto">
                                <h3 className="text-lg font-bold mb-2">User Description</h3>
                                <p className="text-sm mb-4">{sceneDescription[0]}</p>
                                
                                <h3 className="text-lg font-bold mb-2">Composition Idea</h3>
                                <p className="text-sm mb-4 italic text-gray-700">{sceneDescription[4]}</p>
                                
                                <div className="flex justify-between items-center mb-2">
                                    <h3 className="text-lg font-bold">API Description</h3>
                                    <p className="text-m font-bold text-red-500">Seed: {sceneDescription[2]}</p>
                                </div>
                                <p className="text-sm mb-4">{sceneDescription[1]}</p>
                                
                                <h3 className="text-lg font-bold mb-2">Context</h3>
                                {sceneDescription[3] && (
                                    <div className="text-sm">
                                        <div className="mb-2">
                                            <span className="font-semibold">Story Summary:</span> {sceneDescription[3].storySummary}
                                        </div>
                                        <div className="mb-2">
                                            <span className="font-semibold">Environment:</span> {sceneDescription[3].environment}
                                        </div>
                                        <div className="mb-2">
                                            <span className="font-semibold">Current Situation:</span> {sceneDescription[3].currentSituation}
                                        </div>
                                        {sceneDescription[3].characters && (
                                            <div className="mb-2">
                                                <span className="font-semibold">Characters:</span>
                                                <ul className="list-disc pl-4">
                                                    {sceneDescription[3].characters.map((char, index) => (
                                                        <li key={index}>
                                                            <span className="font-medium">{char.name}:</span> {char.description}
                                                            {char.lastSeenDoing && (
                                                                <span className="italic"> (Last Seen doing: {char.lastSeenDoing})</span>
                                                            )}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                        {sceneDescription[3].keyObjects && sceneDescription[3].keyObjects.length > 0 && (
                                            <div>
                                                <span className="font-semibold">Key Objects:</span>
                                                <ul className="list-disc pl-4">
                                                    {sceneDescription[3].keyObjects.map((obj, index) => (
                                                        <li key={index}>{obj}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>                
                        ) : (
                            currentImage && (
                                typeof currentImage === 'string' && (currentImage.startsWith('http') || currentImage.startsWith('blob')) ? (
                                    <img 
                                        src={currentImage} 
                                        alt="Current Page" 
                                        className="max-h-[50vh] min-h-[300px] mx-[auto] aspect-auto object-cover rounded"
                                    /> 
                                ) : (
                                    <div className="max-h-[50vh] mx-[auto] aspect-auto bg-white rounded p-4 overflow-y-auto font-children text-gray-700">
                                        <p className="whitespace-pre-wrap">{currentImage}</p>
                                    </div>
                                )
                            )
                        )}
                        <button
                            className="absolute bottom-2 right-[calc(5%+5px)] bg-white bg-opacity-75 text-black text-s px-2 py-1 rounded-full shadow-md hover:shadow-lg transition-shadow duration-300 flex items-center"
                            onClick={() => setShowDescription(!showDescription)}
                        >
                            {showDescription ? 'See Image' : <><Info className="w-4 h-4 inline-block mr-1" />Info </>}
                        </button>
                    </div>
                    {!isEnhancing ? (
                        <div className="flex flex-col items-center space-y-4">
                            <div className="w-full flex justify-center gap-4 mb-4">
                                <div className="flex-1 flex flex-col items-center">
                                    <button 
                                        className="w-full bg-green-500 hover:bg-green-600 
                                            text-white py-4 px-6 rounded-lg 
                                            transition-all duration-300 ease-in-out 
                                            hover:scale-[1.02] shadow-md hover:shadow-lg
                                            flex items-center justify-center gap-2
                                            font-children font-semibold tracking-[0.075em]
                                            mb-0.5 f"
                                        onClick={() => setIsEnhancing(true)}
                                    >
                                        <Wand2 className="w-6 h-6 flex-shrink-0"/> 
                                        <span>Enhance</span>
                                    </button>
                                    <span className="text-red-500 text-[11px] font-mono font-medium">
                                        -3 credits
                                    </span>
                                </div>
                                <div className="flex-1 flex flex-col items-center">
                                    <button 
                                        className="w-full bg-blue-500 hover:bg-blue-600 
                                            text-white py-4 px-6 rounded-lg 
                                            transition-all duration-300 ease-in-out 
                                            hover:scale-[1.02] shadow-md hover:shadow-lg
                                            flex items-center justify-center gap-2
                                            font-children font-semibold tracking-[0.075em]
                                            mb-0.5"
                                        onClick={handleRegenerate}
                                    >
                                        <RotateCcw className="w-6 h-6 flex-shrink-0"/>
                                        <span>Regenerate</span>
                                    </button>
                                    <span className="text-red-500 text-[11px] font-mono font-medium">
                                        -3 credits
                                    </span>
                                </div>
                            </div>
                            <button 
                                className="w-full max-w-md bg-gray-400 hover:bg-gray-500 
                                    text-white py-3 px-6 rounded-lg 
                                    transition-all duration-300 ease-in-out 
                                    hover:scale-[1.02] shadow-md hover:shadow-lg
                                    font-children font-semibold tracking-wider"
                                onClick={handleClose}
                            >
                                Cancel
                            </button>
                        </div>
                    ) : (
                        <div className="flex flex-col space-y-4 max-h-[40vh]">
                            <div className="bg-white rounded-lg shadow-md overflow-hidden flex-1">
                                <div className="bg-blue-500 text-white px-4 py-2 font-children font-semibold">
                                   
                                </div>
                                <div className="bg-white rounded-b-lg shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)] focus-within:shadow-[inset_0_2px_6px_rgba(0,0,0,0.7)] transition-shadow duration-200 h-full">
                                    <textarea 
                                        className="w-full h-[calc(40vh-120px)] border-0 
                                            focus:outline-none
                                            font-children text-gray-700 resize-none
                                            placeholder:text-gray-400 placeholder:italic
                                            bg-transparent
                                            px-4 pb-4 pt-3"
                                        value={editText}
                                        onChange={(e) => setEditText(e.target.value)}
                                        placeholder="Examples:&#10;• Make the main character smile more&#10;• Add a tree on the left&#10;• Make the colors more vibrant"
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end gap-3">
                                <button 
                                    className="px-6 py-2.5 rounded-lg bg-gray-100 hover:bg-gray-200 
                                        text-gray-700 font-children font-semibold
                                        transition-all duration-300 ease-in-out 
                                        hover:scale-[1.02] shadow-sm hover:shadow-md"
                                    onClick={() => setIsEnhancing(false)}
                                >
                                    Cancel
                                </button>
                                <button 
                                    className={`px-6 py-2.5 rounded-lg font-children font-semibold
                                        transition-all duration-300 ease-in-out 
                                        hover:scale-[1.02] shadow-sm hover:shadow-md
                                        ${editText.trim() !== '' 
                                            ? 'bg-blue-500 hover:bg-blue-600 text-white' 
                                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
                                    onClick={handleEnhance}
                                    disabled={editText.trim() === ''}
                                >
                                    Enhance Image
                                </button>
                            </div>
                        </div>
                    )}
                </>
            
            </div>
        </div>
    );
};

export default EditPage;
