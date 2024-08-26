import {useState} from "react";
import axios from "axios";
import {useTranslation} from "react-i18next";
import InputField from "../UI/ui_input_field.component";
import UI_Switch from "../UI/ui_switch.component";
import UI_Button from "../UI/ui_button";

import '../../Styles/Creation/book_creation.css'
import FlipBook from "../flip_book.component";
import CreationTips from "./creation_tips.component";

const PAGECOUNT = 4

const BookCreation = () => {
    const {t} = useTranslation()
    const [creationVisible, setCreationVisible] = useState(true)
    const [editionVisible, setEditionVisible] = useState(false)
    const [tipsVisible, setTipsVisible] = useState(false)

    const [creationParams, setCreationParams] = useState({description:'', option1: false, option2: false, option3: true})

    const [images, setImages] = useState([])

    const createBook = () => {
        if(creationParams.description==='')return alert(t('creation.warning1'))
        setCreationVisible(false)
        const pages = creationParams.option3?1:PAGECOUNT
        const preferences = creationParams.description
        const forAdult = creationParams.option2
        const greaterQuality = creationParams.option1
        axios.get("http://localhost:5000/api/image/generateImages", {params: {imageCount: pages, preferences: preferences, forAdult: forAdult, greaterQuality: greaterQuality}}).then((r)=> {
            console.log(r.data)
            setImages(r.data)
        })
    }

    const showEdition = (e) => {
        if(e.target === e.currentTarget) setEditionVisible(true) //check whether it is this component triggering and not a child trigger bubbling up
    }

    const showTips = () => {
        setTipsVisible(!tipsVisible)
    }

    const updateParameter = param => value => setCreationParams({...creationParams, [param]: value})

    const editionForm = () => {
        const loadingPage = <>Loading <div className="loader"></div></>
        const editionPage = <div style={{width:'100vw', height:'100vh'}}>
            <FlipBook title={creationParams.description} pages_directory={''} pages={images}/>
        </div>

        return <div className={'edition-container'}>
            {images.length===0 ? loadingPage : editionPage}
        </div>
    }

    const creationForm = () => <div className={'creation-container'}>
        <UI_Button button_text={t('creation.tips_button')} help_button={true} callbackFunction={showTips}/>
        <div className={`creation-form ${!creationVisible ? 'slide-up' : ''}`} onTransitionEnd={showEdition}>
            <InputField updateValue={updateParameter('description')} width={'40vw'} placeholder_text={t('creation.placeholder1')}/>
            <div className={"switches-container"}>
                <div><UI_Switch updateValue={updateParameter('option1')}/> <span className={'switch-caption'}>{t('creation.option1')}</span></div>
                <div><UI_Switch updateValue={updateParameter('option2')}/> <span className={'switch-caption'}>{t('creation.option2')}</span></div>
                <div><UI_Switch updateValue={updateParameter('option3')} toggled={true}/> <span className={'switch-caption'}>{t('creation.option3')}</span></div>
                <UI_Button button_text={t('creation.create')} callbackFunction={createBook}/>
            </div>
        </div>
        <CreationTips visible={tipsVisible} setVisible={setTipsVisible}/>
    </div>

    return editionVisible?editionForm():creationForm()
}
export default BookCreation;
