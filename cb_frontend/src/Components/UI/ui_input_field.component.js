import '../../Styles/UI/input_field.css'
import {useEffect, useRef, useState} from "react";

const InputField = ({ width, height, placeholder_text, updateValue}) => {
    const textareaRef = useRef(null)

    useEffect(() => {
        const textarea = textareaRef.current
        const adjustHeight = () => {
            textarea.style.height = 'auto'; // Reset the height
            textarea.style.height = `${textarea.scrollHeight}px`; // Set height based on scroll height

            // Ensure the textarea doesn't exceed a max-height, allowing scrolling
            if (textarea.scrollHeight > parseInt(window.getComputedStyle(textarea).maxHeight)) {
                textarea.style.overflowY = 'scroll';
            } else {
                textarea.style.overflowY = 'hidden';
            }
        }
        adjustHeight()

        textarea.addEventListener('input', adjustHeight)

        return () =>textarea.removeEventListener('input', adjustHeight)

    }, [])

    return (
        <div className="field" style={{ width: width }}>
            <textarea
                ref={textareaRef}
                placeholder={placeholder_text}
                style={{ resize: 'none', overflow: 'hidden', width: width}} // Disable manual resizing
                onChange={e=> updateValue(e.target.value)}
            />
            <div className="line"  style={{ width: width }}/>
        </div>
    );
};

export default InputField