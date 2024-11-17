import { Pencil } from "lucide-react";
import React from "react";
import PropTypes from "prop-types";
import { motion } from "framer-motion";

const EditButton = ({ position, onClick, disabled }) => {
    const isLeft = position === 'left';
    const INITIAL_DELAY = 0.45;
    return (
        <motion.button 
            className={`absolute bottom-16 ${isLeft ? 'left-16' : 'right-16'}  
                    w-16 h-16
                    bg-blue-400/75
                    shadow-lg hover:shadow-xl hover:bg-blue-400
                    ${isLeft ? 'rounded-tr-full' : 'rounded-tl-full'}
                    group
                    overflow-hidden
                    origin-bottom-${isLeft ? 'left' : 'right'}                    
                    z-10`}
            onClick={onClick}
            disabled={disabled}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ 
                type: "spring", 
                stiffness: 400, 
                damping: 17,
                delay: INITIAL_DELAY // Initial delay before button appears
            }}
        >
            <motion.div
                initial={{ opacity: 0, rotate: -180 }}
                animate={{ 
                    opacity: 1,
                    rotate: 0,
                }}
                transition={{
                    duration: 0.5,
                    delay: 0.2+INITIAL_DELAY,
                    ease: "backOut"
                }}
                className={`absolute bottom-3 ${isLeft ? 'left-2' : 'right-2'}`}
            >
                <motion.div
                    animate={{ 
                        opacity: [0.6, 1, 0.6],
                        y: [-1, 1, -1],
                        rotate: [-5, 5, -5],
                    }}
                    transition={{
                        repeat: Infinity,
                        duration: 2,
                        ease: "easeInOut",
                        delay: 0.7+INITIAL_DELAY
                    }}
                >
                    <Pencil 
                        className={`h-8 w-8 
                                text-white group-hover:text-blue-800
                                cursor-pointer
                                drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]
                                transition-all duration-300 ${isLeft && 'scale-x-[-1]'}`}
                    />
                </motion.div>
            </motion.div>
        </motion.button>
    );
};

EditButton.propTypes = {
    position: PropTypes.oneOf(['left', 'right']).isRequired,
    onClick: PropTypes.func.isRequired,
    disabled: PropTypes.bool
};

export default EditButton;