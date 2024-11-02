import React, { useState } from 'react';
import {Ban, ChevronRight, Send, ArrowLeft, MessageSquare } from 'lucide-react';
import api from '../../Hooks/ApiHandler';
import { useDispatch, useSelector } from 'react-redux';
import { addNotification, setAskFeedback } from '../../redux/websiteSlice';
import { useTranslation } from 'react-i18next';

const Feedback = () => {
    const dispatch = useDispatch();
    const askFeedback = useSelector(state => state.website.askFeedback);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedEmoji, setSelectedEmoji] = useState(null);
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { t } = useTranslation();

    // If askFeedback is false, don't render anything
    if (!askFeedback) return null;

    const emojis = [
        { rating: '1', emoji: '😠' },
        { rating: '2', emoji: '🙁' },
        { rating: '3', emoji: '😐' },
        { rating: '4', emoji: '🙂' },
        { rating: '5', emoji: '😍' }
    ];

    const handleSubmit = async () => {
        if (!selectedEmoji) return;
        
        setIsSubmitting(true);
        try {
            await api.post('/user/feedback', {
                rating: selectedEmoji.rating,
                comment: comment.trim()
            });
            
            // Reset states
            setIsOpen(false);
            setSelectedEmoji(null);
            setComment('');
            
            // Turn off feedback request
            dispatch(setAskFeedback(false));

            dispatch(addNotification({
                type: 'success',
                message: t('feedback.thank-you-for-your-feedback'),
                duration: 3000
            }));

        } catch (error) {
            dispatch(addNotification({
                type: 'error',
                message: error.response?.data?.error || t('feedback.failed-to-submit-feedback-please-try-again'),
                duration: 5000
            }));
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleBack = () => {
        setSelectedEmoji(null);
        setComment('');
    };

    // Update the submit button to show loading state
    const SubmitButton = () => (
        <button
            onClick={handleSubmit}
            className="w-full px-4 py-2.5
                bg-amber-500 hover:bg-amber-600
                text-white font-children font-medium
                rounded-lg
                transition-colors duration-200
                flex items-center justify-center gap-2
                disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isSubmitting}
        >
            {isSubmitting ? (
                <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Sending...</span>
                </>
            ) : (
                <>
                    <span>{t('feedback.send-feedback')}</span>
                    <Send className="w-4 h-4" />
                </>
            )}
        </button>
    );

    return (
        <div className="fixed bottom-0 right-0 z-50">
            {/* Feedback Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`
                    fixed right-6 bottom-6 sm:right-8 sm:bottom-8
                    w-11 h-11 sm:w-12 sm:h-12
                    bg-amber-500 hover:bg-amber-600
                    text-white 
                    rounded-full
                    shadow-lg hover:shadow-xl
                    transition-all duration-300
                    flex items-center justify-center
                    group
                    ${isOpen ? 'opacity-0' : 'opacity-100'}
                `}
                aria-label={t('feedback.rate-your-experience')}
            >
                <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            {/* Feedback Modal */}
            <div className={`
                fixed right-6 bottom-6 sm:right-8 sm:bottom-8
                bg-white/95 backdrop-blur-sm
                p-4 sm:p-6 rounded-lg
                shadow-2xl
                transition-all duration-300 ease-in-out
                ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}
                w-[300px] sm:w-[360px]
            `}>
                <div className="flex flex-col items-center gap-4">
                    {!selectedEmoji ? (
                        <>
                            <h3 className="text-xl text-center font-children font-semibold text-gray-700 mb-2">
                                {t('feedback.how-would-you-rate-your-experience')} </h3>
                            
                            <div className="grid grid-cols-5 w-full">
                                {emojis.map((item, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedEmoji(item)}
                                        className="group flex flex-col items-center justify-center gap-2"
                                    >
                                        <span className="text-3xl sm:text-4xl transform transition-transform duration-200 group-hover:scale-125">
                                            {item.emoji}
                                        </span>
                                        <span className="text-xs sm:text-sm text-gray-500 font-children opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                            {item.rating}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="flex items-center gap-3 self-start">
                                <button 
                                    onClick={handleBack}
                                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                >
                                    <ArrowLeft className="w-5 h-5 text-gray-600" />
                                </button>
                                <h3 className="text-xl font-children font-semibold text-gray-700">
                                    {t('feedback.feedback-for')} {selectedEmoji.emoji}
                                </h3>
                            </div>

                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder={t('feedback.tell-us-more-about-your-experience')}
                                className="w-full h-32 p-3 border rounded-lg 
                                    focus:ring-2 focus:ring-amber-400
                                    focus:outline-none
                                    resize-none font-children"
                                autoFocus
                            />

                            <SubmitButton />
                        </>
                    )}

                    {!selectedEmoji && (
                        <button
                            onClick={() => {
                                setIsOpen(false)
                                dispatch(setAskFeedback(false))
                            }}
                            className="mt-4 px-4 py-2 
                                text-gray-600 hover:text-gray-800 
                                font-children font-medium
                                bg-gray-100 hover:bg-gray-200
                                rounded-lg
                                transition-all duration-200
                                flex items-center gap-2
                                group"
                        >
                            <Ban className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                            <span>{t('feedback.not-now')}</span>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Feedback;
