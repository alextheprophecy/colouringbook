import { motion, AnimatePresence } from 'framer-motion';
import { useCallback, useState, useRef, useEffect } from 'react';

const AUTOMATIC_SLIDE_INTERVAL = 1500;
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
        
        autoSlideTimer.current = setInterval(() => {
            if (!isAnimating && isAutoSliding) {
                setDirection(1);
                setIsAnimating(true);
                setCurrentImageIndex((prevIndex) => (prevIndex + 1) % imageNames.length);
            }
        }, AUTOMATIC_SLIDE_INTERVAL);
    }, [imageNames.length, isAnimating, isAutoSliding]);

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
                    className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white/70 p-2 rounded-full shadow-md hover:shadow-lg"
                    disabled={isAnimating}
                >
                    &lt;
                </button>
                <button 
                    onClick={handleNextImage} 
                    className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white/70 p-2 rounded-full shadow-md hover:shadow-lg"
                    disabled={isAnimating}
                >
                    &gt;
                </button>
            </div>
            <motion.div 
                className="w-full md:w-1/2 space-y-4 text-center md:text-left"
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
                viewport={{ once: true }}
            >
                <h2 className="text-2xl font-children font-semibold text-gray-800">
                    {title}
                </h2>
                <p className="text-gray-600">
                    {description}
                </p>
            </motion.div>
        </motion.div>
    );
};

export default FeatureCard;