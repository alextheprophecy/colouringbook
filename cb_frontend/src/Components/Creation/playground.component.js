import {useState} from "react";
import api from "../../Hooks/ApiHandler";
import '../../Styles/Creation/playground.css'
const Playground = () => {
    const [preferences, setPreferences] = useState("snails, bees, chess, and ice cream.")
    const [pageCount, setPageCount] = useState(2)

    const [bookDescr, setBookDescr] = useState([])

    const updatePreferences = (e) => {
        setPreferences(e.target.value)
    }
    const updatePageCount = (e) => {
        setPageCount(e.target.value)
    }
    const handleUpload = () => {
        console.log("sending", URL)
        api.get("/image/generateDescription", {params: {imageCount: pageCount, preferences: preferences}}).then((r)=> {
            console.log(r.data)
            setBookDescr(r.data)
        })
    }

    const showBook = () => {
        return bookDescr.map(d => <span className={'playground-text'}>{d}<br/><br/></span>)
    }

    return     <div className={'playground-container'}>
        <input type='number' value={pageCount} onChange={updatePageCount}/>
        <br/>
        <input type="text" value={preferences} onChange={updatePreferences}/>
        <br/>
        <button onClick={handleUpload}> Add </button>
        <div className='playground-text-container'>{showBook()}</div>
    </div>
}
export default Playground;
