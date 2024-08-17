import {useState} from "react";
import axios from "axios";
import '../Styles/main.css'

const ColourBookify = () => {
    const [URL, setURL] = useState("https://imageio.forbes.com/specials-images/imageserve/654a43b3c975e9da610b21c3/Celebrity-Xcel/0x0.jpg?format=jpg&crop=1196,672,x56,y405,safe&width=960");
    const [image, setImage] = useState(null)
    const [detailed, setDetailed] = useState(false)

    const updateURL = (e) => {
        if (e.target.value)setURL(e.target.value)
    }

    const toggleCheck = (e) => {
        setDetailed(e.target.checked)
    }
    const handleUpload = () => {
        console.log("sending", URL)
        axios.get("http://localhost:5000/api/image/modify", {params: {imageUrl: URL, detailed: detailed}}).then((r)=> {
            console.log(r.data)
            setImage(r.data)
        })
    }

    return <div>
        <h2>Upload file or enter URL</h2>
        <input type="text" value={URL} placeholder={"URL"} onChange={updateURL}/>
        <input type={"checkbox"} onChange={toggleCheck}/>:Detailed
        <button onClick={handleUpload}> Add </button>
        <br/>
        {image? <img style={{width: '90vw'}} src={image}/>:""}
    </div>
}

/*<input type="file" onChange={handleFormUpdate}/>
        <br/>
        OR
        <br/>*/


export default ColourBookify;