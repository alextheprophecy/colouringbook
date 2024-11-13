import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { TriangleAlert } from 'lucide-react';
import {
    BarLoader,
    BeatLoader,
    BounceLoader,
    CircleLoader,
    ClimbingBoxLoader,
    ClipLoader,
    ClockLoader,
    DotLoader,
    FadeLoader,
    GridLoader,
    HashLoader,
    PacmanLoader,
    PropagateLoader,
    PuffLoader,
    PulseLoader,
    RingLoader,
    RiseLoader,
    RotateLoader,
    ScaleLoader,
    SyncLoader,
    SquareLoader
} from 'react-spinners';

const SPINNERS = [
    BarLoader,
    BeatLoader,
    BounceLoader,
    CircleLoader,
    ClimbingBoxLoader,
    ClipLoader,
    ClockLoader,
    DotLoader,
    FadeLoader,
    GridLoader,
    HashLoader,
    PacmanLoader,
    PropagateLoader,
    PuffLoader,
    PulseLoader,
    RingLoader,
    RiseLoader,
    RotateLoader,
    ScaleLoader,
    SyncLoader,
    SquareLoader
];

const Loading = () => {
    const { t } = useTranslation();
    const { loadingText, isLoading, dontRefreshWarning } = useSelector((state) => state.website);

    // Use useMemo to keep the same spinner during re-renders
    const RandomSpinner = useMemo(() => 
        SPINNERS[Math.floor(Math.random() * SPINNERS.length)],
    []);

    if (!isLoading) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-gradient-to-b from-blue-500/90 to-blue-600/90 backdrop-blur-sm z-[100] flex justify-center items-center"
        >
            <motion.div 
                initial={{ y: window.innerHeight }}
                animate={{ y: 0 }}
                transition={{ 
                    type: "spring",
                    stiffness: 400,
                    damping: 30,
                    mass: 4,
                    velocity: -800
                }}
                className="bg-white p-8 rounded-2xl w-full max-w-md shadow-2xl"
            >
                <div className="flex flex-col items-center space-y-3">
                    {loadingText && (
                        <motion.h2
                            initial={{ opacity: 0 }}
                            animate={{ 
                                opacity: 1,
                                scale: [1, 1.05, 1],
                            }}
                            transition={{ 
                                opacity: { duration: 0.3 },
                                scale: {
                                    repeat: Infinity,
                                    duration: 2,
                                    ease: "easeInOut"
                                }
                            }}
                            className="text-4xl font-children font-bold text-[#22c55e] [word-spacing:0.4rem] text-center"
                        >
                            {loadingText}
                        </motion.h2>
                    )}
                    
                    <div className="relative w-24 h-24 flex items-center justify-center">
                        <RandomSpinner
                            color="#22c55e"
                            speedMultiplier={0.7}
                            
                        />
                    </div>

                    {dontRefreshWarning && (
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3, delay: 0.5 }}
                            className="text-red-500 font-sans text-lg flex items-center gap-2"
                        >
                            <TriangleAlert className="w-5 h-5" />
                            {t('creation.dont-refresh')}
                        </motion.p>
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
};

export default Loading;
