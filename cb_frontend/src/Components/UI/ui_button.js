import '../../Styles/UI/button.css'
const UI_Button = ({button_text, callbackFunction, help_button}) => {
    return <button className={`create_button ${help_button?'help-button':''}`} onClick={callbackFunction}>{button_text}</button>
}

export default UI_Button