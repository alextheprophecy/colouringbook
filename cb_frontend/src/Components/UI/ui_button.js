import '../../Styles/UI/button.css'
const UI_Button = ({button_text, callbackFunction}) => {
    return <button className={'create_button'} onClick={callbackFunction}>{button_text}</button>
}

export default UI_Button