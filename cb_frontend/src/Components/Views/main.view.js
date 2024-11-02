import React from 'react';
import { motion } from 'framer-motion';
import ScribbleText from '../UI/ui_scribble_text.component';
import FeatureCard from '../LandingPage/FeatureCard';
import { ChevronDown } from 'lucide-react';
import { scroller } from 'react-scroll';
import { useTranslation } from 'react-i18next';

const MainView = () => {
    // Add state for button visibility
    const [isCreateButtonVisible, setIsCreateButtonVisible] = React.useState(false);
    const { t } = useTranslation();
    // Add scroll detection
    React.useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                // Add a small delay before updating visibility
                if (!entry.isIntersecting) {
                    setTimeout(() => {
                        setIsCreateButtonVisible(entry.isIntersecting);
                    }, 100);
                } else {
                    setIsCreateButtonVisible(entry.isIntersecting);
                }
            },
            {
                root: null,
                threshold: 0.1, // Lower threshold for smoother transition
                rootMargin: '100px'
            }
        );

        const targetButton = document.getElementById('start-creating-button');
        if (targetButton) {
            observer.observe(targetButton);
        }

        return () => {
            if (targetButton) {
                observer.unobserve(targetButton);
            }
        };
    }, []);

    return (
        <div className="min-h-screen bg-paper from-blue-50 to-blue-100 relative">
            {/* Paper texture overlay with gradient */}
            <div 
                className="absolute inset-0 pointer-events-none bg-gradient-to-b from-blue-50/50 to-blue-300/50 z-0"
            />
            
            {/* Content wrapper with relative positioning */}
            <div className="relative z-10">
                {/* Hero Section */}
                <div className="w-full py-16 text-center">
                    <motion.div
                        className="mb-3 mx-auto max-w-4xl px-4 flex justify-center items-center"
                        initial={{ y: -50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ 
                            type: 'spring',
                            stiffness: 50,
                            damping: 12,
                            delay: 0.2
                        }}
                    >
                        <div className="transform-gpu flex justify-center w-full">
                            <ScribbleText
                                text={t('home.crayons')}
                                sizeFactor={1.4}
                                fillColor="#027a9f"
                                strokeColor="#00a4d7"
                                roughness={1.8}
                                strokeWidth={2}
                                animate={true}
                            />
                        </div>
                    </motion.div>
                    <motion.p 
                        className="text-lg text-gray-600 max-w-2xl mx-auto px-4 font-children leading-relaxed -mt-1"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ 
                            y: {
                                type: "spring",
                                stiffness: 100,
                                damping: 8,  // Lower damping means more bounce
                                mass: 0.5,   // Lower mass means faster movement
                                delay: 1.2   // Add delay after title animation
                            },
                            opacity: {
                                duration: 0.5,
                                ease: "easeOut",
                                delay: 1.2   // Match the delay for opacity
                            }
                        }}
                    >
                        <span className="text-gray-700 font-semibold drop-shadow-sm [word-spacing:0.1em] bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                            {t('home.make-colouring-books-from-your-own-stories')} </span>
                    </motion.p>
                </div>

                {/* Feature Cards */}
                <div className="max-w-7xl mx-auto px-4 pb-16 -mt-4 space-y-12">
                    <FeatureCard
                        index={0}
                        imagePosition="left"
                        title={t('home.feature-1-title')}
                        description={t('home.feature-1-description')}
                        directory="/assets/features_showcase/creative"
                        imageNames={['mosquito.jpg', 'snakemario.jpg']}
                    />
                    <FeatureCard
                        index={1}
                        imagePosition="right"
                        title={t('home.feature-2-title')}
                        description={t('home.feature-2-description')}
                        directory="/assets/features_showcase/enhance"
                        imageNames={['turtle/enhanced.png', 'donkey/enhanced.png']}
                    />
                    <FeatureCard
                        index={2}
                        imagePosition="left"
                        title={t('home.feature-3-title')}
                        directory="/assets/features_showcase/simple"
                        imageNames={['birthdayParty.png', 'download.png', 'im0.jpg', 'im2.jpg', 'im4.jpg', 'img2.jpg', 'mario spiderman playing chess.jpg', 'witches.png']}
                        description={t('home.feature-3-description')}
                    />
                    
                    {/* CTA Button */}
                    <motion.div 
                        className="text-center pt-8"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        viewport={{ once: true }}
                    >
                        <button 
                            id="start-creating-button"
                            name="start-creating-button"
                            className="px-8 py-4 bg-blue-500 hover:bg-blue-600 
                                text-white rounded-lg 
                                transition-all duration-300 ease-in-out 
                                hover:scale-[1.02] hover:shadow-lg
                                font-children font-semibold tracking-wider
                                flex items-center justify-center gap-2 mx-auto
                                shadow-[0_4px_14px_0_rgb(0,118,255,39%)]"
                        >
                            {t('home.start-creating')} </button>
                    </motion.div>
                </div>
            </div>

            {/* Floating tag */}
            <motion.button
                className="fixed bottom-6
                    inset-x-0  
                    mx-auto    
                    bg-blue-500 text-white px-6 py-2 rounded-full
                    shadow-md hover:shadow-lg
                    flex flex-col items-center
                    z-50
                    group
                    w-fit"
                onClick={() => {
                    scroller.scrollTo('start-creating-button', {
                        duration: 800,
                        smooth: true,
                        offset: -window.innerHeight / 3
                    });
                }}
                initial={{ y: 0, opacity: 0 }}
                animate={{ 
                    y: [0, '7px', 0],
                    opacity: isCreateButtonVisible ? 0 : 1,
                    scale: isCreateButtonVisible ? 0.8 : 1,
                }}
                transition={{ 
                    y: {
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                    },
                    opacity: {
                        duration: isCreateButtonVisible ? 0.5 : 1,
                        ease: "easeInOut",
                        delay: isCreateButtonVisible ? 0 : 2
                    },
                    scale: {
                        duration: 0.5,
                        ease: "easeInOut"
                    }
                }}
            >
                <span className="font-children font-semibold text-base whitespace-nowrap">{t('home.get-started')}</span>
                <ChevronDown className="w-5 h-5 group-hover:translate-y-1 transition-transform duration-300" />
            </motion.button>
        </div>
    );
}

export default MainView;

