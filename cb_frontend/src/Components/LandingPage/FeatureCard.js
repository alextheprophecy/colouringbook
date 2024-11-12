import { motion, AnimatePresence } from 'framer-motion';
import { useCallback, useState, useRef, useEffect, React } from 'react';
import PropTypes from 'prop-types';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ScribbleText from '../UI/ui_scribble_text.component';
const BASE_SLIDE_INTERVAL = 2000;
const INTERVAL_VARIANCE = 250;
const INACTIVITY_DELAY = 4000;

const slideVariants = {
    initial: (direction) => ({
        x: direction > 0 ? '100%' : '-100%',
        opacity: 0,
        position: 'absolute'
    }),
    animate: {
        x: 0,
        opacity: 1,
        position: 'absolute'
    },
    exit: (direction) => ({
        x: direction > 0 ? '-100%' : '100%',
        opacity: 0,
        position: 'absolute'
    })
};

const FeatureCard = ({ imagePosition = 'left', title, description, index, directory, imageNames = [] }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const [direction, setDirection] = useState(0);
    const [isAutoSliding, setIsAutoSliding] = useState(true);
    
    const autoSlideTimer = useRef(null);
    const inactivityTimer = useRef(null);

    const startAutoSlide = useCallback(() => {
        if (imageNames.length <= 1) return;
        
        if (autoSlideTimer.current) clearInterval(autoSlideTimer.current);
        
        const randomInterval = BASE_SLIDE_INTERVAL + (Math.random() * INTERVAL_VARIANCE) + (index * 200);
        
        autoSlideTimer.current = setInterval(() => {
            if (!isAnimating && isAutoSliding) {
                setDirection(1);
                setIsAnimating(true);
                setCurrentImageIndex((prevIndex) => (prevIndex + 1) % imageNames.length);
            }
        }, randomInterval);
    }, [imageNames.length, isAnimating, isAutoSliding, index]);

    const resetInactivityTimer = useCallback(() => {
        if (inactivityTimer.current) {
            clearTimeout(inactivityTimer.current);
        }

        const timeoutId = setTimeout(() => {
            console.log('Waint');
            setIsAutoSliding(true);
            startAutoSlide();
        }, INACTIVITY_DELAY);
        inactivityTimer.current = timeoutId;
    }, [startAutoSlide]);


    useEffect(() => {
        startAutoSlide();    
    }, [startAutoSlide]);

    useEffect(() => {
        // Cleanup function that only runs on unmount
        return () => {
            if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
        };
    }, []); // Empty dependency array means this only runs on mount/unmount

    const handleNextImage = (event) => {
        event.preventDefault();
        if (isAnimating) return;
        
        setIsAutoSliding(false);
        if (autoSlideTimer.current) clearInterval(autoSlideTimer.current);
        
        setDirection(1);
        setIsAnimating(true);
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % imageNames.length);
        
        resetInactivityTimer();
    };

    const handlePrevImage = (event) => {
        event.preventDefault();
        if (isAnimating) return;
        
        setIsAutoSliding(false);
        if (autoSlideTimer.current) clearInterval(autoSlideTimer.current);
        
        setDirection(-1);
        setIsAnimating(true);
        setCurrentImageIndex((prevIndex) => (prevIndex - 1 + imageNames.length) % imageNames.length);      
        
        resetInactivityTimer();
    };

    const handleAnimationComplete = () => {
        setIsAnimating(false);
    };

    return (
        <motion.div
            className={`w-full bg-white rounded-lg shadow-md hover:shadow-lg relative overflow-hidden p-6 flex flex-col ${imagePosition === 'right' ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-8`}
            initial={{ 
                x: imagePosition === 'left' ? '-40%' : '40%',
                opacity: 0,
                scale: 0.8,
            }}
            whileInView={{ 
                x: 0,
                opacity: 1,
                scale: 1,
                transition: {
                    type: 'tween',
                    damping: 20,
                    stiffness: 70,
                    duration: 0.8,
                    delay: index * 0.2,
                }
            }}
            viewport={{ 
                once: true,
                amount: 0.2
            }}
        >
            <div className="w-full md:w-1/2 aspect-[2.8/3] bg-gray-200 rounded-lg overflow-hidden relative">
                <AnimatePresence initial={false} mode="sync" custom={direction}>
                    <motion.div
                        key={currentImageIndex}
                        custom={direction}
                        variants={slideVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        className="w-full h-full absolute inset-0"
                        onAnimationComplete={handleAnimationComplete}
                        
                        transition={{ 
                            type: 'spring', 
                            duration: 0.55
                        }}
                    >
                        <img
                            src={`${directory}/${imageNames[currentImageIndex]}`}
                            alt={`Example${currentImageIndex + 1}`}
                            className="w-full h-full object-cover"
                        />
                    </motion.div>
                </AnimatePresence>
                <button 
                    onClick={handlePrevImage} 
                    className="absolute left-1 top-1/2 transform -translate-y-1/2 bg-white rounded-full shadow-md hover:shadow-lg p-2"
                    disabled={isAnimating}
                >
                    <ChevronLeft className="w-6 h-6 text-blue-500" />
                </button>
                <button 
                    onClick={handleNextImage} 
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-white rounded-full shadow-md hover:shadow-lg p-2"
                    disabled={isAnimating}
                >
                    <ChevronRight className="w-6 h-6 text-blue-500" />
                </button>
            </div>
            <motion.div 
                className="w-full md:w-1/2 space-y-4 text-center md:text-left flex flex-col"
                initial={{ 
                    y: 30,
                    opacity: 0 
                }}
                whileInView={{ 
                    y: 0,
                    opacity: 1,
                    transition: {
                        type: 'tween',
                        damping: 25,
                        stiffness: 100,
                        duration: 0.5,
                        delay: index * 0.2 + 0.25,
                    }
                }}
                viewport={{ once: true }}>
                    <div className="flex justify-center">
                        <ScribbleText
                            text={title}
                            sizeFactor={0.4}
                            fillColor="#1f2937"  // text-gray-800 equivalent
                            strokeColor="#374151" // slightly lighter for stroke
                            roughness={0.6}
                            strokeWidth={1.5}
                            animate={true}
                        />
                    </div>
                <p className="text-gray-600 min-h-[4rem] flex items-center md:items-start justify-center md:justify-start">
                    {description}
                </p>
            </motion.div>
        </motion.div>
    );
};

FeatureCard.propTypes = {
    imagePosition: PropTypes.string,
    title: PropTypes.string,
    description: PropTypes.string,
    index: PropTypes.number,
    directory: PropTypes.string,
    imageNames: PropTypes.arrayOf(PropTypes.string),
};

export default FeatureCard;