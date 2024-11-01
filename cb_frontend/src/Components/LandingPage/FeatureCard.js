import { motion } from 'framer-motion';
import { useRef } from 'react';

const FeatureCard = ({ imagePosition = 'left', title, description, index }) => {
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
                    type: 'tween', // Change to tween for smoother animation
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
            <div className="w-full md:w-1/2 aspect-video bg-gray-200 rounded-lg overflow-hidden">
                <motion.div 
                    className="w-full h-full flex items-center justify-center text-gray-400"
                    initial={{ 
                        x: imagePosition === 'left' ? -30 : 30,
                        opacity: 0 
                    }}
                    whileInView={{ 
                        x: 0,
                        opacity: 1,
                        transition: {
                            type: 'spring',
                            damping: 25,
                            stiffness: 100,
                            duration: 0.5,
                            delay: index * 0.2 + 0.15,
                        }
                    }}
                    viewport={{ once: true }}
                >
                    Image/Video {index + 1}
                </motion.div>
            </div>
            <motion.div 
                className="w-full md:w-1/2 space-y-4"
                initial={{ 
                    y: 30,
                    opacity: 0 
                }}
                whileInView={{ 
                    y: 0,
                    opacity: 1,
                    transition: {
                        type: 'tween', // Change to tween for smoother animation
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