import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import useCreatePage from '../../Hooks/CreateBook/useCreatePage';
import { BookPlus, Image, Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { BarLoader } from 'react-spinners';
import { MODEL_COSTS } from '../../Constants/qualityOptions';
const CreatePage = React.forwardRef(({classNameProp, onMouseEnter, onMouseLeave, disabled}, ref) => {  
    const { t } = useTranslation();
    const {settings: creationSettings, isLoading} = useSelector(state => state.website);
    const textareaRef = useRef(null);
    const {
        createImage,
        description,
        handleDescriptionChange
    } = useCreatePage();

    const handleClick = (e) => {
        onMouseEnter(e);
        // Add a small delay to ensure mouse events are disabled before focusing
        setTimeout(() => {
            textareaRef.current?.focus();
        }, 150);
    };

    return (
        <div 
            ref={ref}
            className="page-element"   
        >
            {/* Border layer */}
            <div className={`${classNameProp} absolute inset-0 bg-[#93C5FD]`} />
            
            {/* Content layer */}
            <div className={`${classNameProp} shadow-none  absolute inset-0 bg-white scale-[0.993]`}>                            
                <div className="relative w-full h-full">                                   
                    {/* Content container */}
                    {(isLoading && !disabled) ? 
                        <div className="flex flex-col items-center justify-center h-full">
                            <p className="text-blue-600 font-children text-xl mb-4">{t('creation.hooks.creating-image')}</p>
                            <BarLoader color="#3B82F6" width={150} />                            
                        </div>
                    : 
                    <div className="flex flex-col h-full pt-8 px-6">
                        <textarea
                            ref={textareaRef}
                            className={`w-[100%] h-[80%] mx-auto p-4 bg-transparent rounded-[5px]
                                    focus:outline-none resize-none
                                    text-gray-700 placeholder-gray-400
                                    font-children text-lg leading-relaxed
                                    shadow-[inset_0_0_10px_rgba(0,0,0,0.3)]
                                    transition-shadow duration-500
                                    focus:shadow-[inset_0_0_10px_rgba(0,0,0,0.5)]
                                    ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
                            placeholder={t('creation.a-goblin-in-a-forest-eating-a-mushroom')}
                            value={description}
                            onChange={handleDescriptionChange}   
                            onClick={disabled ? undefined : handleClick}
                            onMouseLeave={onMouseLeave}    
                            disabled={disabled}                            
                        />
                        
                        <div className="relative group mt-auto mb-2 self-center flex flex-col items-center">
                            <button
                                onClick={createImage}
                                disabled={disabled}
                                className={`relative flex items-center gap-2 px-5 py-2 
                                        rounded-lg shadow-md border-b-4 
                                        transform transition-all duration-200
                                        mb-0.5
                                        ${disabled 
                                            ? 'bg-gray-300 cursor-not-allowed border-gray-600' 
                                            : 'bg-blue-500 border-blue-600 hover:bg-blue-600 hover:shadow-lg hover:scale-[1.02]'
                                        }`}
                            >
                                <Image className="w-5 h-5 text-white" />
                                <span className="text-white text-lg font-children font-semibold">{t('creation.create-page')}</span>
                            </button>
                            <span className="text-red-500 text-[0.9rem] md:text-[1.1rem] font-mono font-medium">
                                <strong>-{MODEL_COSTS[creationSettings.usingModel]}</strong> {t('edition.credits')}
                            </span>
                        </div>
                    </div>}
                </div>
            </div>
        </div>
    );
});


CreatePage.propTypes = {
    classNameProp: PropTypes.string,
    onMouseEnter: PropTypes.func,
    onMouseLeave: PropTypes.func
}
CreatePage.displayName = 'CreatePage';


export default CreatePage;
