import { useState, React } from 'react';
import '../../Styles/UI/number_input.css';

const NumberInput = ({rangeMin = 1, rangeMax = 6, updateValue, defaultValue}) => {
    // State to manage the number input
    const [value, setValue] = useState(defaultValue)

    // Increment the value
    const changeValue = (delta) => () => {
        const newV = value + delta
        if(newV <= rangeMax && newV >= rangeMin){
            updateValue(newV)
            setValue(newV)
        }
    }


    return (
        <div className="number-input-container">
            <div className="number-display">
                <input
                    type="number"
                    className="number-input"
                    min={rangeMin}
                    max={rangeMax}
                    value={value}
                    readOnly
                />
            </div>
            <div className="arrow-controls">
                <button className="arrow up" onClick={changeValue(1)}>&#9650;</button>
                <button className="arrow down" onClick={changeValue(-1)}>&#9660;</button>
            </div>
        </div>
    );
};

export default NumberInput
