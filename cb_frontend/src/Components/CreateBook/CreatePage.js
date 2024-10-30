import React from 'react';
import useCreatePage from '../../Hooks/CreateBook/useCreatePage';
import { Plus } from 'lucide-react';

const CreatePage = React.forwardRef(({classNameProp, testMode}, ref) => {  
    const {
        createImage,
        description,
        handleDescriptionChange
    } = useCreatePage(testMode);


    return (
        <div ref={ref} className="page-element">
            {/* Border layer */}
            <div className={`${classNameProp} absolute inset-0 bg-amber-200`} />
            
            {/* Content layer */}
            <div className={` mx-auto w-full h-full object-cover rounded-[3px] rounded-tl-[45%_5%] rounded-bl-[40%_3%] absolute inset-0 bg-white scale-[0.99]`}>                            
                <div className="relative w-full h-full">                                   
                    {/* Content container */}
                    <div className="flex flex-col h-full pt-8 px-6">
                        <textarea
                            className="w-[100%] h-[80%] mx-auto p-4 bg-transparent 
                                    focus:outline-none resize-none
                                    text-gray-700 placeholder-gray-400
                                    font-children text-lg leading-relaxed
                                    shadow-[inset_0_0_10px_rgba(0,0,0,0.1)]"
                            placeholder="A goblin in a forest eating a mushroom..."
                            value={description}
                            onChange={handleDescriptionChange}                                   
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
                                <Plus className="w-5 h-5 text-amber-700" />
                                <span className="text-amber-800 text-lg font-children font-semibold">Create Page</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
});

export default CreatePage;
