import React from 'react';
import { motion } from 'framer-motion';
import ScribbleText from '../UI/ui_scribble_text.component';
import FeatureCard from '../LandingPage/FeatureCard';

const MainView = () => {
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
                                text="Crayons"
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
                        className="text-xl text-gray-600 max-w-2xl mx-auto px-4 font-children leading-relaxed"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.8, duration: 0.6 }}
                    >
                        <span className="text-gray-700 font-semibold drop-shadow-sm [word-spacing:0.1em] bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                            Make colouring books from your own stories
                        </span>
                    </motion.p>
                </div>

                {/* Feature Cards */}
                <div className="max-w-7xl mx-auto px-4 pb-20 space-y-12">
                    <FeatureCard
                        index={0}
                        imagePosition="left"
                        title="AI-Powered Creation"
                        description="Describe your story and watch as our AI transforms your words into beautiful coloring pages. Perfect for children's books, educational materials, or creative projects."
                    />
                    <FeatureCard
                        index={1}
                        imagePosition="right"
                        title="Interactive Book Editor"
                        description="Edit, enhance, and customize your coloring book pages with our intuitive editor. Add details, modify scenes, and create the perfect coloring experience."
                    />
                    <FeatureCard
                        index={2}
                        imagePosition="left"
                        title="Instant PDF Download"
                        description="Download your creation instantly as a PDF, ready for printing and coloring. Share your books with friends, family, or use them in your classroom."
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
                            className="px-8 py-4 bg-blue-500 hover:bg-blue-600 
                                text-white rounded-lg 
                                transition-all duration-300 ease-in-out 
                                hover:scale-[1.02] hover:shadow-lg
                                font-children font-semibold tracking-wider
                                flex items-center justify-center gap-2 mx-auto
                                shadow-[0_4px_14px_0_rgb(0,118,255,39%)]"
                        >
                            Start Creating
                        </button>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}

export default MainView;

