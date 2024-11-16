import React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';

const Loading = () => {
    const { t } = useTranslation();
    const { loadingText, isLoading } = useSelector((state) => state.website);

    return (
        <AnimatePresence>
            {isLoading && (
                <motion.div
                    initial={{ y: -100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -100, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg"
                >
                    <div className="container mx-auto px-4 py-3">
                        <div className="flex items-center justify-center gap-3">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <p className="text-lg font-children font-semibold">
                                {loadingText || t('modifybook.loading')}
                            </p>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Loading;
