import '../../Styles/UI/switch.css'
const UI_Switch = ({toggled, updateValue}) => {

    return <label className="switch">
        <input type="checkbox" defaultChecked={toggled} onChange={e => updateValue(e.target.checked)}/>
        <span className="slider"></span>
    </label>
}

export default UI_Switch