import {useState} from "react";
import axios from "axios";

const GenerateBook = () => {
    const [preferences, setPreferences] = useState("snails, bees, chess, and ice cream.")
    const [pages, setPages] = useState([])
    const PAGECOUNT = 2

    const updatePreferences = (e) => {
        setPreferences(e.target.value)
    }
    const handleUpload = () => {
        console.log("sending", URL)
        axios.get("http://localhost:5000/api/image/generate", {params: {imageCount: PAGECOUNT, preferences: preferences}}).then((r)=> {
            console.log(r.data)
            alert(r.data)
            // setPages(r.data)
        })
    }

    const showBook = () => {
        return pages.map(p =>
            (<h3>{p}</h3>)
        )
    }

    return     <div>
        <input type="text" value={preferences} onChange={updatePreferences}/>
        <button onClick={handleUpload}> Add </button>
        {showBook()}
    </div>
}
export default GenerateBook;
