import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import ModifyBook from "../CreateBook/ModifyBook";
import Loading from '../CreateBook/Loading';
import useCreateBook from '../../Hooks/CreateBook/useCreateBook';
import { useTranslation } from 'react-i18next';
import { Book } from 'lucide-react';
import ScribbleText from "../UI/ui_scribble_text.component";

const CreateBook = () => {
    const { hasBookStarted } = useSelector(state => state.book);
    const { credits, isLoading } = useSelector(state => state.website);
    const { createBook } = useCreateBook();
    const [title, setTitle] = useState('');
    const { t } = useTranslation();

    const handleCreateBook = async () => {
        await createBook(title);
    };

    const CreationContainer = (children) => (
        <div className={`${isLoading ? 'pointer-events-none opacity-50' : ''} w-[90vw] mt-[0] ml-[5vw] mr-[5vw] z-20`}>
            {children}
        </div>
    );
    
    return (
        <>
            <div className="min-h-screen flex items-center justify-center relative">
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-blue-50/50 to-blue-300/50" />                    
                {!hasBookStarted ? (
                    <div className="w-full max-w-md mx-4 p-8 bg-white/95 backdrop-blur-sm rounded-lg shadow-xl relative z-20">
                        <div className="mb-8 flex justify-center">
                            <ScribbleText
                                text={t('creation.create-your-book')}
                                sizeFactor={0.6}
                                fillColor="#027a9f"
                                strokeColor="#00a4d7"
                                roughness={1.25}
                                strokeWidth={2}
                                animate={true}
                            />
                        </div>

                        <div className="space-y-6">
                            <div className="flex justify-center mb-6">
                                <div className={`px-4 py-2 rounded-full 
                                    ${credits > 0 ? 'bg-green-100/80' : 'bg-red-100/80'} 
                                    shadow-sm 
                                    backdrop-blur-sm
                                    font-mono text-sm
                                    transition-all duration-200`}
                                >
                                    {credits > 0 ? (
                                        <span className="text-green-700">
                                            {credits} {t('creation.credits-remaining')}
                                        </span>
                                    ) : (
                                        <span className="text-red-600">
                                            {t('modifybook.credits.out_of_credits')}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="relative">
                                <div className="flex items-center gap-3">
                                    <label className="text-blue-600 font-children font-semibold text-lg whitespace-nowrap">
                                        {t('creation.title')}:
                                    </label>
                                    <div className="relative flex-1">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Book className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input 
                                            type="text" 
                                            value={title} 
                                            onChange={(e) => setTitle(e.target.value)} 
                                            placeholder={t('creation.enter-book-title')} 
                                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 font-children bg-white/50"
                                        />
                                    </div>
                                </div>
                            </div>

                            <button 
                                onClick={handleCreateBook} 
                                disabled={credits < 3}
                                className={`w-full py-3 rounded-lg transition-all duration-300 transform hover:scale-[1.02] font-children font-semibold tracking-wide
                                    ${credits >= 3 
                                        ? 'bg-blue-500 hover:bg-blue-600 text-white' 
                                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                            >
                                {credits >= 3 ? t('creation.start-creating') : t('creation.not-enough-credits')}
                            </button>
                        </div>                                           
                    </div>) : (
                CreationContainer(<ModifyBook />)
            )}
             
            </div>
            {isLoading && <Loading />}
        </>
    );
};

export default CreateBook;
