import '../../Styles/UI/input_field.css'
import {useEffect, useRef, useState, React} from "react";
import PropTypes from 'prop-types';
const InputField = ({ width, height, placeholder_text, updateValue}) => {
    const textareaRef = useRef(null)
    const [startHeight, setStartHeight] = useState('0px')

    useEffect(() => {
        const textarea = textareaRef.current
        setStartHeight(`${textarea.scrollHeight}px`)

        textarea.style.height = 'auto'; // Reset the height
        textarea.style.height = `${textarea.scrollHeight}px`; // Set height based on scroll height

        const adjustHeight = () => {
            textarea.style.height = 'auto'; // Reset the height
            textarea.style.height = `${textarea.scrollHeight}px`; // Set height based on scroll height

            if (textarea.value === '' || !textarea.value.includes('\n')) {
                textarea.style.height = '50px'
            }
            // Ensure the textarea doesn't exceed a max-height, allowing scrolling
            if (textarea.scrollHeight > parseInt(window.getComputedStyle(textarea).maxHeight)) {
                textarea.style.overflowY = 'scroll';
            } else {
                textarea.style.overflowY = 'hidden';
            }
        }

        const resetHeight = () => {
            if (textarea.value === '') textarea.style.height = startHeight
        }

        textarea.addEventListener('input', adjustHeight)
        textarea.addEventListener('click', adjustHeight)
        textarea.addEventListener('focusout', resetHeight)

        return () => {
            textarea.removeEventListener('input', adjustHeight)
            textarea.removeEventListener('click', adjustHeight)
            textarea.addEventListener('focusout', resetHeight)
        }

    }, [textareaRef.current])

    return (
        <div className="field" style={{ width: width}}>
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

InputField.propTypes = {
    width: PropTypes.string,
    height: PropTypes.string,
    placeholder_text: PropTypes.string,
    updateValue: PropTypes.func
}
export default InputField