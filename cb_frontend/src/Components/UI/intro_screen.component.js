import React from 'react';
import { motion } from 'framer-motion';
import ScribbleText from '../UI/ui_scribble_text.component';
import '../../Styles/UI/intro_screen.css';

const IntroScreen = () => {
    return (
        <motion.div
            className="intro-screen"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 2, ease: 'easeInOut' } }}
        >
            <div className="intro-title">
                <motion.div
                    className="colour-my"
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 50, damping: 10 }}
                >
                    <ScribbleText
                        text="Colour my "
                        roughness={1.5}
                        fillColor="#027a9f"
                        strokeColor="#00a4d7"
                    />
                </motion.div>

                <motion.div
                    className="dreams"
                    initial={{ y: 100, opacity: 0, scale: 0.8 }}
                    animate={{ y: 0, opacity: 1, scale: 1.3 }}
                    transition={{
                        type: 'spring',
                        stiffness: 50,
                        damping: 10,
                        delay: 1.2,
                    }}
                >
                    <ScribbleText
                        text="journey"
                        roughness={1.5}
                        fillColor="#027a9f"
                        strokeColor="#00a4d7"
                    />
                </motion.div>
            </div>
        </motion.div>
    );
};

export default IntroScreen;
