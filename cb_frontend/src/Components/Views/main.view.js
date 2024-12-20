import React from 'react';
import { motion } from 'framer-motion';
import ScribbleText from '../UI/ui_scribble_text.component';
import FeatureCard from '../LandingPage/FeatureCard';
import { ChevronDown, Sparkles } from 'lucide-react';
import { scroller } from 'react-scroll';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { isUserLoggedIn } from '../../Hooks/UserDataHandler';

const MainView = () => {
    const navigate = useNavigate();
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

    const handleStartCreating = () => {
        if (isUserLoggedIn()) {
            navigate('/create');
        } else {
            navigate('/login');
        }
    };

    return (
        <div className="min-h-screen from-blue-50 to-blue-100 relative">
            {/* Paper texture overlay with gradient */}
            <div 
                className="absolute inset-0 pointer-events-none bg-gradient-to-b from-blue-50/50 to-blue-300/50 z-0"
            />            
            
            {/* Content wrapper with relative positioning */}
            <div className="relative z-10">
                {/* Hero Section */}
                <div className="w-full py-16 text-center">
                    <motion.div
                        className="mb-3 mx-auto max-w-4xl px-4 flex justify-center items-center relative"
                        initial={{ y: -50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ 
                            type: 'spring',
                            stiffness: 50,
                            damping: 12,
                            delay: 0.2
                        }}
                    >
                        <div className="absolute inset-0 bg-title-banner bg-no-repeat bg-center bg-contain transform md:scale-125 scale-y-125 opacity-60 md:translate-x-[5%] translate-x-[3%] " />
                        
                        <div className="transform-gpu flex justify-center w-full relative z-10">
                            <ScribbleText
                                text={"Crayons"}
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
                        className="text-lg text-gray-600 max-w-2xl mx-auto px-4 font-children leading-relaxed -mt-2"
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
                        <span className={`text-gray-700 font-semibold drop-shadow-sm [word-spacing:0.1em] bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent md:text-2xl text-lg`}>
                            {t('home.make-colouring-books-from-your-own-stories')}
                        </span>
                    </motion.p>
                </div>

               

                {/* Feature Cards */}
                <div className="max-w-7xl mx-auto px-4 pb-16 -mt-2 space-y-12">
                   
                    <FeatureCard
                        index={0}
                        imagePosition="right"
                        title={t('home.feature-2.title')}
                        description={t('home.feature-2.description')}
                        directory="/assets/features_showcase/Any Story"
                        imageNames={['moon.png', 'ant.png', 'trampoline.png', 'vampire_party.png', 'goblin.png', 'boy.png', 'playground.png', ]}
                    />                    
                    <FeatureCard
                        index={1}
                        imagePosition="left"
                        title={t('home.feature-3.title')}
                        directory="/assets/features_showcase/creative"
                        imageNames={['monkey.png', 'pizza_Detective.png', 'super_mushroom.png', 'smart_dog.png', 'steal.png', 'mosquito.jpg']}
                        description={t('home.feature-3.description')}
                    />
                    <FeatureCard
                        index={2}
                        imagePosition="right"
                        title={t('home.feature-4.title')}
                        description={t('home.feature-4.description')}
                        directory="/assets/features_showcase/enhance"
                        imageNames={['donkey-bike.png', 'turtle.png']}
                    />
                     <FeatureCard
                        index={3}
                        imagePosition="left"
                        title={t('home.feature-1.title')}
                        description={t('home.feature-1.description')}
                        directory="/assets/features_showcase/HauntedHouse"
                        imageNames={['p0_2.png', 'p1.png', 'p2.png', 'p3.png', 'p4.png', 'p7.png']
                            /* [
                            'book-football-rabbits/out-0.jpg', 'book-football-rabbits/pic4.jpg',  'book-football-rabbits/pic2.jpg', 'book-football-rabbits/pic3.jpg',  
                            'book-football-rabbits/pic6.jpg', 'book-football-rabbits/pic7.jpg', 'book-football-rabbits/pic5.jpg'
                            ] */
                        }
                    />
                    <FeatureCard
                        index={4}
                        imagePosition="right"
                        title={t('home.feature-5.title')}
                        description={t('home.feature-5.description')}
                        directory="/assets/features_showcase/simple"
                        imageNames={['birthdayParty.png', 'chess_game.jpg','img2.jpg',  'im0.jpg', 'im2.jpg', 'witches.png', 'img16.jpg', 'im1.jpg']}
                    />
                    
                    {/* Demo Video Section */}
                    {/* <div className="w-full max-w-7xl mx-auto px-4 pb-16 -mt-8">
                        <motion.div
                            className="relative rounded-xl overflow-hidden shadow-2xl bg-white"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ 
                                duration: 0.8,
                                delay: 0.3
                            }}
                            viewport={{ once: true }}
                        >
                            
                            <div className="aspect-video relative">
                                <video
                                    className="w-full h-full object-cover"
                                    autoPlay
                                    muted
                                    loop
                                    playsInline
                                    poster="/assets/video-poster.jpg"
                                >
                                    <source src="/assets/features_showcase/demo-video.mp4" type="video/mp4" />
                                    Your browser does not support the video tag.
                                </video>
                                
                               
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                                
                              
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <motion.div
                                        className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center cursor-pointer"
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <div className="w-0 h-0 border-t-8 border-t-transparent border-l-12 border-l-blue-500 border-b-8 border-b-transparent ml-1" />
                                    </motion.div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                     */}
                    {/* CTA Button */}
                    <motion.div 
                        className="text-center pt-8"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        viewport={{ once: true }}
                    >
                        <div className="relative inline-block">
                            {/* Bottom edge layer */}
                            <div className={`absolute inset-x-0 bottom-0 h-4                                                                    
                                bg-green-700/90
                                rounded-b-xl translate-y-1/2 blur-[1px]
                                transform-gpu transition-all duration-300 ease-out
                                group-hover:translate-y-[60%] group-hover:blur-[2px]
                                group-active:translate-y-[30%]`}
                            />
                            
                            
                            {/* Main button - keeping original size */}
                            <motion.button 
                                id="start-creating-button"
                                name="start-creating-button"
                                onClick={handleStartCreating}
                                className={`group relative px-10 py-5                                  
                                    bg-gradient-to-r from-green-500 via-green-600 to-green-500 
                                    text-white rounded-xl
                                    transition-all duration-300 ease-out
                                    hover:scale-105 hover:-translate-y-1
                                    font-children font-bold tracking-wider
                                    flex items-center justify-center gap-2
                                    min-w-[240px]
                                    overflow-hidden
                                    
                                    /* Shine Effect */
                                    after:absolute
                                    after:content-['']
                                    after:top-0
                                    after:-left-[100%]
                                    after:w-[75%]
                                    after:h-full
                                    after:bg-gradient-to-r
                                    after:from-transparent
                                    after:via-white/30
                                    after:to-transparent
                                    after:skew-x-[-45deg]
                                    after:animate-[shine_4s_ease-in-out_infinite]
                                    
                                    /* Shadow styles with circular glow */
                                    shadow-[0_8px_0_0_rgb(0,0,0,0.1),0_14px_20px_-5px_rgba(0,0,0,0.3),0_0_20px_2px_rgba(0,128,0,0.15)]
                                    hover:shadow-[0_12px_0_0_rgb(0,0,0,0.1),0_18px_24px_-8px_rgba(0,0,0,0.4),0_0_25px_5px_rgba(0,128,0,0.2)]
                                    active:shadow-[0_4px_0_0_rgb(0,0,0,0.1),0_8px_12px_-3px_rgba(0,0,0,0.3),0_0_15px_2px_rgba(0,128,0,0.15)]
                                    
                                    before:absolute before:inset-0
                                    before:bg-gradient-to-b before:from-white/20 before:to-transparent
                                    before:rounded-xl`}
                            >
                                
                                <motion.span
                                    className="relative z-10 text-xl text-yellow-400 "                   
                                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                >
                                    <ScribbleText
                                        text={t('home.start-creating')}
                                        roughness={0.45}                                        
                                        fillColor="white"
                                        strokeColor="white"
                                        strokeWidth={0.9}
                                        animate={true}
                                        sizeFactor={0.25}
                                    />
                                </motion.span>                                
                                
                            </motion.button>

                            
                            {/* Sparkles wrapper - positioned relative to button */}
                            <div className="absolute inset-0 pointer-events-none">
                                <Sparkles className="absolute -top-3 -right-3 w-8 h-8 text-yellow-400 
                                    drop-shadow-[0_0_8px_rgba(250,204,21,0.8)] 
                                    filter brightness-125
                                    animate-[pulse_2s_ease-in-out_infinite]" 
                                />
                                <Sparkles className="absolute -bottom-3 -left-3 w-7 h-7 text-yellow-400 
                                    drop-shadow-[0_0_8px_rgba(250,204,21,0.8)]
                                    filter brightness-125
                                    animate-[pulse_2s_ease-in-out_infinite_0.5s]" 
                                />
                            </div>
                        </div>
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
                    w-fit
                    /* Shine Effect */
                    after:absolute
                    after:content-['']
                    after:top-0
                    after:-left-[100%]
                    after:w-[75%]
                    after:h-full
                    after:bg-gradient-to-r
                    after:from-transparent
                    after:via-white/30
                    after:to-transparent
                    after:skew-x-[-45deg]
                    after:animate-[shine_4s_ease-in-out_infinite]
                    overflow-hidden
                    "
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

