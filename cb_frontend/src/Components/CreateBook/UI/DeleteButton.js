import React, { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { resetPersistedState } from '../../../redux/store';
import { useTranslation } from 'react-i18next';
const DeleteButton = () => {
    const dispatch = useDispatch();
    const [showConfirm, setShowConfirm] = useState(false);
    const { t } = useTranslation();
    
    return (
        <div className="relative w-full flex justify-center mb-4">
            <AnimatePresence mode="wait">
                {!showConfirm ? (
                    <motion.button
                        key="delete-button"
                        initial={{ x: 0, opacity: 1 }}
                        exit={{ x: -100, opacity: 0, rotate: -180 }}
                        onClick={() => setShowConfirm(true)}
                        className="py-2 px-2 text-sm text-red-600 hover:text-red-700
                                bg-white/75 hover:bg-red-100
                                rounded-lg
                                font-children flex items-center justify-center gap-2 mt-2"
                    >
                        <Trash2 className="w-6 h-6" />
                    </motion.button>
                ) : (
                    <motion.div
                        key="confirm-buttons"
                        initial={{ x: 100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        className="flex flex-col items-center gap-2 w-full bg-white p-4 rounded-lg shadow-md"
                    >
                        <p className="text-md text-red-600">{t('delete.are-your-sure')}</p>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setShowConfirm(false)}
                                className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-700 
                                        bg-gray-100 hover:bg-gray-200 rounded-lg"
                            >
                                {t('home.feature-cancel')}
                            </button>
                            <button
                                onClick={() => {
                                    dispatch(resetPersistedState());
                                    setShowConfirm(false);
                                }}
                                className="px-3 py-1.5 text-sm text-white 
                                        bg-red-600 hover:bg-red-700 rounded-lg"
                            >
                                {t('delete.delete')}
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default DeleteButton;
