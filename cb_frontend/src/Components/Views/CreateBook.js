import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ModifyBook from "../CreateBook/ModifyBook";
import Loading from '../CreateBook/Loading';
import useCreateBook from '../../Hooks/CreateBook/useCreateBook';
import { useTranslation } from 'react-i18next';
import { Book, Ticket } from 'lucide-react';
import ScribbleText from "../UI/ui_scribble_text.component";

const CreateBook = () => {
    const { hasBookStarted } = useSelector(state => state.book);
    const { credits, isLoading } = useSelector(state => state.website);
    const { createBook } = useCreateBook();
    const [title, setTitle] = useState('');
    const { t } = useTranslation();
    const navigate = useNavigate();

    const handleCreateBook = async () => {
        await createBook(title);
    };

    const handleRedeemCoupon = () => {
        navigate('/profile');
    };

    const CreationContainer = (children) => (
        <div className={`w-[90vw] mt-[0] ml-[5vw] mr-[5vw] z-20`}>
            {children}
        </div>
    );
    
    return (
        <>
            <div className="min-h-screen flex items-center justify-center relative">
                <div className="absolute inset-0 pointer-events-none bg-paper opacity-30" />
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-blue-50/50 to-blue-300/50" />
                
                {!hasBookStarted ? (
                    <div className="w-full max-w-md mx-4">
                        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg p-8 border border-gray-100">
                            <div className="mb-10 flex justify-center">
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

                            <div className="space-y-8">
                                <div className="flex justify-center">
                                    <div className={`px-6 py-2.5 rounded-full 
                                        ${credits > 0 
                                            ? 'bg-green-50 text-green-700 ring-1 ring-green-100' 
                                            : 'bg-red-50 text-red-600 ring-1 ring-red-100'} 
                                        font-medium text-sm
                                        transition-all duration-200`}
                                    >
                                        {credits > 0 ? (
                                            <span>
                                                {credits} {t('creation.credits-remaining')}
                                            </span>
                                        ) : (
                                            <span>
                                                {t('modifybook.credits.out_of_credits')}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {credits > 0 && (<div className="relative">
                                    <div className="flex items-center gap-3">
                                        <label className="text-gray-700 font-children font-semibold text-lg">
                                            {t('creation.title')}:
                                        </label>
                                        <div className="relative flex-1">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <Book className="h-5 w-5 text-blue-400" />
                                            </div>
                                            <input 
                                                type="text" 
                                                value={title} 
                                                onChange={(e) => setTitle(e.target.value)} 
                                                placeholder={t('creation.enter-book-title')} 
                                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 
                                                    rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-300 
                                                    transition-all duration-200 font-children"
                                            />
                                        </div>
                                    </div>
                                </div>)}

                                <div className="space-y-3">
                                    <button 
                                        onClick={credits <= 0 ? handleRedeemCoupon : handleCreateBook}
                                        className={`w-full py-3.5 rounded-xl transition-all duration-200 
                                            font-children font-semibold text-base text-white shadow-sm
                                            ${credits > 0 
                                                ? 'bg-blue-500 hover:bg-blue-600 ' 
                                                : 'bg-green-500 hover:bg-green-600 '}`}
                                    >
                                        {credits > 0 ? t('creation.start-creating') : t('creation.not-enough-credits')}
                                    </button>
                                </div>
                            </div>                                           
                        </div>
                    </div>
                ) : (
                    CreationContainer(<ModifyBook />)
                )}
            </div>
            {isLoading && <Loading />}
        </>
    );
};

export default CreateBook;
