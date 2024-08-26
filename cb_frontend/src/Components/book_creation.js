import {useState} from "react";
import axios from "axios";
import {useTranslation} from "react-i18next";
import InputField from "./UI/ui_input_field.component";
import UI_Switch from "./UI/ui_switch.component";
import UI_Button from "./UI/ui_button";

import '../Styles/book_creation.css'
import generateFlipBook from "./example_book.component";

const PAGECOUNT = 2

const BookCreation = () => {
    const {t} = useTranslation()
    const [creationVisible, setCreationVisible] = useState(true)
    const [editionVisible, setEditionVisible] = useState(false)
    const [creationParams, setCreationParams] = useState({description:'', option1: false, option2: false, option3: true})

    const [images, setImages] = useState([])

    const createBook = () => {
        if(creationParams.description==='')return alert('please fill in the book description')
        setCreationVisible(false)
        const pages = creationParams.option3?1:PAGECOUNT
        const preferences = creationParams.description
        axios.get("http://localhost:5000/api/image/generate", {params: {imageCount: pages, preferences: preferences}}).then((r)=> {
            console.log(r.data)
            alert(r.data)
            setImages(r.data)
        })
    }

    const showEdition = (e) => {
        if(e.target === e.currentTarget) setEditionVisible(true) //check whether it is this component triggering and not a child trigger bubbling up
    }

    const updateParameter = param => value => setCreationParams({...creationParams, [param]: value})

    const creationForm = () => <div className={`creation-form ${!creationVisible ? 'slide-up' : ''}`} onTransitionEnd={showEdition}>
        <InputField updateValue={updateParameter('description')} width={'40vw'} placeholder_text={t('creation.placeholder')}/>
        <div className={"switches-container"}>
            <div><UI_Switch updateValue={updateParameter('option1')}/> <span className={'switch-caption'}>{t('creation.option1')}</span></div>
            <div><UI_Switch updateValue={updateParameter('option2')}/> <span className={'switch-caption'}>{t('creation.option2')}</span></div>
            <div><UI_Switch updateValue={updateParameter('option3')} toggled={true}/> <span className={'switch-caption'}>{t('creation.option3')}</span></div>
            <UI_Button button_text='Create Book' callbackFunction={createBook}/>
        </div>
    </div>

    const editionForm = () => {
        const loadingPage = <>Loading <div className="loader"></div></>
        const editionPage = <>
            {images.map(img => generateFlipBook({}))}


        </>

        return <div className={'edition-container'}>
            {images.length===0? loadingPage : editionPage}
        </div>
    }


    return editionVisible?editionForm():creationForm()
}
export default BookCreation;
