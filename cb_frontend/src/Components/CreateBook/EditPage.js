import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import useEditPage from '../../Hooks/CreateBook/useEditPage';
import {Wand2, RotateCcw, Info} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import ImageQualityOptions from './UI/ImageQualityOptions';
import { MODEL_COSTS } from '../../Constants/qualityOptions';
const EditPage = () => {
    const { t } = useTranslation();
    const {currentPage} = useSelector((state) => state.book);
    const {settings, credits} = useSelector((state) => state.website);
    const dispatch = useDispatch()

    const {
        editText,
        setEditText,
        isVisible,
        currentImage,
        handleClose,
        showDescription,
        setShowDescription,
        sceneDescription,
        isEnhancing,
        setIsEnhancing,
        handleRegenerate,
        handleEnhance
    } = useEditPage();

    const hasEnoughCredits = credits>=MODEL_COSTS[settings.usingModel];

    if (!isVisible || currentPage === 0) return null;        

    return (
        <div 
            className={`fixed inset-0 bg-black bg-opacity-70 flex justify-center items-start 
                z-[500] overflow-y-auto overscroll-contain`}
            onClick={handleClose}
        >
            <div 
                className={`bg-white rounded-lg w-full max-w-4xl mx-6
                    relative my-6
                    grid grid-cols-1 lg:grid-cols-2 gap-2 p-6`}
                onClick={(e) => e.stopPropagation()}
            >   
                {/* Left Column - Image/Info Preview */}
                <div className="relative w-full h-[50vh] lg:h-[70vh] bg-gray-50 rounded-lg overflow-y">
                    {showDescription ? (
                        <div className="h-full overflow-y-auto bg-gray-100 p-4">
                            <h3 className="text-lg font-bold mb-2">{t('edition.user-description')}</h3>
                            <p className="text-sm mb-4">{sceneDescription[0]}</p>
                            
                            <h3 className="text-lg font-bold mb-2">{t('edition.composition-idea')}</h3>
                            <p className="text-sm mb-4 italic text-gray-700">{sceneDescription[4]}</p>
                            
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="text-lg font-bold">{t('edition.api-description')}</h3>
                                <p className="text-m font-bold text-red-500">Seed: {sceneDescription[2]}</p>
                            </div>
                            <p className="text-sm mb-4">{sceneDescription[1]}</p>
                            
                            <h3 className="text-lg font-bold mb-2">{t('edition.context')}</h3>
                            {sceneDescription[3] && (
                                <div className="text-sm">
                                    <div className="mb-2">
                                        <span className="font-semibold">{t('edition.story-summary')}</span> {sceneDescription[3].storySummary}
                                    </div>
                                    <div className="mb-2">
                                        <span className="font-semibold">{t('edition.environment')}</span> {sceneDescription[3].environment}
                                    </div>
                                    <div className="mb-2">
                                        <span className="font-semibold">{t('edition.current-situation')}</span> {sceneDescription[3].currentSituation}
                                    </div>
                                    {sceneDescription[3].characters && (
                                        <div className="mb-2">
                                            <span className="font-semibold">Characters:</span>
                                            <ul className="list-disc pl-4">
                                                {sceneDescription[3].characters.map((char, index) => (
                                                    <li key={index}>
                                                        <span className="font-medium">{char.name}:</span> {char.description}
                                                        {char.lastSeenDoing && (
                                                            <span className="italic"> ({t('edition.last-seen-doing')}{char.lastSeenDoing})</span>
                                                        )}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                    {sceneDescription[3].keyObjects && sceneDescription[3].keyObjects.length > 0 && (
                                        <div>
                                            <span className="font-semibold">{t('edition.key-objects')}</span>
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
                                    alt={t('edition.current-page')} 
                                    className="w-full h-full object-contain rounded"
                                /> 
                            ) : (
                                <div className="h-full bg-white p-4 overflow-y-auto font-children text-gray-700">
                                    <p className="whitespace-pre-wrap">{currentImage}</p>
                                </div>
                            )
                        )
                    )}
                    <button
                        className="absolute bottom-4 right-4 bg-white/90 hover:bg-white text-black px-3 py-1.5 
                            rounded-full shadow-md hover:shadow-lg transition-all duration-300 
                            flex items-center gap-2"
                        onClick={() => setShowDescription(!showDescription)}
                    >
                        {showDescription ? (
                            <>{t('edition.see-image')}</>
                        ) : (
                            <><Info className="w-4 h-4" /> {t('edition.info')}</>
                        )}
                    </button>
                </div>

                {/* Right Column - Actions */}
                <div className="flex flex-col h-[50vh] lg:h-[70vh]">            
                    {!isEnhancing ? (
                        <div className="flex flex-col h-full justify-between">
                            {/* Action Cards */}
                            <div className="space-y-4">
                                {/* Enhance Card */}
                                <div className={`group  px-4 py-3 rounded-lg shadow-md hover:shadow-lg 
                                    transition-all duration-300 hover:scale-[1.01] border border-gray-100
                                    ${!hasEnoughCredits ? 'bg-green-100 cursor-not-allowed' : 'bg-green-300'}`}>
                                    <button 
                                        className={`w-full flex items-center gap-4 ${!hasEnoughCredits ? 'bg-green-100 text-gray-400 cursor-not-allowed' : 'text-green-600'}`}
                                        onClick={() => setIsEnhancing(true)}
                                        disabled={!hasEnoughCredits}
                                    >
                                        <div className={`flex-shrink-0 p-3 rounded-full 
                                            group-hover:bg-green-200 transition-colors duration-300
                                            ${!hasEnoughCredits ? 'bg-green-200' : 'bg-green-600'}`}>
                                            <Wand2 className="w-6 h-6 text-white" />
                                        </div>
                                        <div className="flex-1 text-left">
                                            <h3 className="font-children font-semibold">
                                                {t('edition.enhance')}
                                            </h3>
                                        </div>
                                        <span className="text-xs font-mono text-red-500 ml-2">
                                            <strong>-{MODEL_COSTS[settings.usingModel]}</strong> {t('edition.credits')}
                                        </span>
                                    </button>
                                    {hasEnoughCredits && (
                                        <p className="text-xs text-green-600 text-center -mt-2">
                                            {t('edition.enhance-description')}
                                        </p>
                                    )}
                                </div>

                                {/* Regenerate Card */}
                                <div className={`group px-4 py-3 rounded-lg shadow-md hover:shadow-lg 
                                    transition-all duration-300 hover:scale-[1.01] border border-gray-100 
                                    ${!hasEnoughCredits ? 'bg-blue-100 cursor-not-allowed' : 'bg-blue-300'}`}>
                                    <button 
                                        className={`w-full flex items-center gap-4 ${!hasEnoughCredits ? 'bg-blue-100 text-gray-400 cursor-not-allowed' : ' text-blue-600 '}`}
                                        onClick={handleRegenerate}
                                        disabled={!hasEnoughCredits}
                                    >
                                        <div className={`flex-shrink-0 p-3 rounded-full 
                                            group-hover:bg-blue-200 transition-colors duration-300 
                                            ${!hasEnoughCredits ? 'bg-blue-200' : 'bg-blue-600'}`}>
                                            <RotateCcw className="w-6 h-6 text-white" />
                                        </div>
                                        <div className="flex-1 text-left">
                                            <h3 className={`font-children font-semibold mb-1 `}>
                                                {t('edition.regenerate')}
                                            </h3>
                                        </div>
                                        <span className="text-xs font-mono text-red-500 ml-2">
                                            <strong>-{MODEL_COSTS[settings.usingModel]}</strong> {t('edition.credits')}
                                        </span>
                                    </button>
                                </div>
                            

                            {/* Creative Model Toggle */}
                            <ImageQualityOptions />

                            </div>

                            {/* Desktop Cancel Button - Now at bottom */}
                            <div className="mt-auto pt-2">
                                <button 
                                    className="w-full bg-gray-100 hover:bg-gray-200 
                                        text-gray-700 py-3 px-6 rounded-lg
                                        font-children font-semibold
                                        border border-gray-200 hover:border-gray-300
                                        flex items-center justify-center gap-2"
                                    onClick={handleClose}
                                >
                                    {t('cancel')}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col h-full">
                            {/* Enhancement Mode UI */}
                            <div className="flex-1 bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 flex flex-col">
                                <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-3">
                                    <h3 className="font-children font-semibold text-lg">
                                        {t('edition.enhance-image')}
                                    </h3>
                                    <p className="text-sm text-blue-100">
                                        {t('edition.enhancement-description')}
                                    </p>
                                </div>
                                <div className="p-4 flex-1">
                                    <textarea 
                                        className="w-full h-full border-0 
                                            focus:outline-none resize-none font-children text-gray-700
                                            placeholder:text-gray-400 placeholder:italic
                                            bg-gray-50 p-3 rounded-lg"
                                        value={editText}
                                        onChange={(e) => setEditText(e.target.value)}
                                        placeholder={t('edition.examples-and-10-make-the-main-character-smile-more-and-10-add-a-tree-on-the-left-and-10-make-the-colors-more-vibrant')}
                                    />
                                </div>
                            </div>
                            
                            {/* Enhancement Mode Actions */}
                            <div className="flex justify-around flex-row gap-3 mt-4">
                                <button 
                                    className="px-6 py-2.5 rounded-lg bg-gray-100 hover:bg-gray-200 
                                        text-gray-700 font-children font-semibold transition-all duration-300
                                        border border-gray-200 hover:border-gray-300"
                                    onClick={() => setIsEnhancing(false)}
                                >
                                    {t('cancel')}
                                </button>
                                <button 
                                    className={`px-6 py-2.5 rounded-lg font-children font-semibold
                                        transition-all duration-300 shadow-sm hover:shadow
                                        ${(editText.trim() !== '' && hasEnoughCredits)
                                            ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white' 
                                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
                                    onClick={handleEnhance}
                                    disabled={(editText.trim() === '') || !hasEnoughCredits}
                                >
                                    {t('edition.enhance-image')}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EditPage;
