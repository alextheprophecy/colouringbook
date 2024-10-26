import React from 'react';
import { useDispatch } from 'react-redux';
import useCreatePage from '../../Hooks/CreateBook/useCreatePage';
import { CirclePlus } from 'lucide-react';
import { useState } from 'react';

const CreatePage = ({ pageClassname }) => {  
    const {
        createImage
    } = useCreatePage();


    const [description, setDescription] = useState('');
    const handleTextareaClick = (e) => {
        e.stopPropagation();
    };

    return (
        <div className="page-element">
            {/* Border layer */}
            <div className={`${pageClassname(1)} absolute inset-0 bg-amber-200`} />
            
            {/* Content layer */}
            <div className={` mx-auto w-full h-full object-cover rounded-[3px] rounded-tl-[45%_5%] rounded-bl-[40%_3%] absolute inset-0 bg-white scale-[0.99]`}>                            
                <div className="relative w-full h-full">                                   
                    {/* Content container */}
                    <div className="flex flex-col h-full pt-8 px-6" onClick={handleTextareaClick}>
                        <textarea
                            className="w-[100%] h-[80%] mx-auto p-4 bg-transparent 
                                    focus:outline-none resize-none
                                    text-gray-700 placeholder-gray-400
                                    font-children text-lg leading-relaxed
                                    shadow-[inset_0_0_10px_rgba(0,0,0,0.1)]"
                            placeholder="Describe your scene..."
                            value={description}
                            onChange={(e) => {
                                setDescription(e.target.value);

                            }} 
                            onClick={handleTextareaClick}
                            onMouseDown={handleTextareaClick}                                        
                        />
                        
                        <div className="relative group mt-auto mb-4 self-center">
                            <div className="absolute -inset-1 bg-gradient-to-r from-amber-200 to-amber-100 rounded-lg blur opacity-25 group-hover:opacity-40 transition duration-200" />
                            <button
                                onClick={createImage}
                                className="relative flex items-center space-x-2 px-5 py-2 
                                        bg-amber-50 hover:bg-amber-100/80 
                                        rounded-lg
                                        shadow-md hover:shadow-lg 
                                        transform hover:scale-105 
                                        transition-all duration-200"
                            >
                                <CirclePlus className="w-5 h-5 text-amber-700" />
                                <span className="font-children text-amber-800 font-medium text-lg">Add</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreatePage;
