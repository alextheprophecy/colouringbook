import {useEffect, useState} from "react";
import axios from "axios";
import {useTranslation} from "react-i18next";
import InputField from "../UI/ui_input_field.component";
import UI_Switch from "../UI/ui_switch.component";
import NumberInput from "../UI/ui_number_input.component";
import UI_Button from "../UI/ui_button";
import Gallery from "../gallery.component";

import '../../Styles/Creation/book_creation.css'
import FlipBook from "../flip_book.component";
import CreationTips from "./creation_tips.component";
import api, {apiGet, apiPost} from "../../Hooks/ApiHandler";
import {
    getUserData,
    getUserId,
    getUserToken,
    isUserLoggedIn,
    saveUserData,
    updateUserData
} from "../../Hooks/UserDataHandler";
import Background from "../UI/background.component";

const PAGE_COUNT = 2
const MAX_PAGE_COUNT = 6

const BookCreation = () => {
    const {t} = useTranslation()
    const [creationVisible, setCreationVisible] = useState(true)
    const [editionVisible, setEditionVisible] = useState(false)
    const [tipsVisible, setTipsVisible] = useState(false)

    const [creationParams, setCreationParams] = useState({description:'', pageCount: PAGE_COUNT, option1: false, option2: false})
    const [creditCost, setCreditCost] = useState(0)
    const [pages, setPages] = useState([])


    useEffect(() => {
        /*if(!isUserLoggedIn()){
            window.location.href = '/login'
        }*/
        //TODO: uncomment for production!
    }, []);

    const createBook = () => {
        if(creationParams.description==='')return alert(t('creation.warning1'))
        setCreationVisible(false)
        const pageCount = creationParams.pageCount
        const preferences = creationParams.description
        const forAdult = creationParams.option2
        const greaterQuality = creationParams.option1

        const bookData = {imageCount: pageCount, preferences: preferences, forAdult: forAdult, greaterQuality: greaterQuality}

        api.post('image/generateImages', bookData).then(r => {
            if(!r) return
            const {credits_updated, pages} = (r.data)
            setPages(pages)
            updateUserData({credits: credits_updated})
        })/*
        api.get('image/test').then(c => {
            if(!c)return
            console.log('SUCCESS:', c.data)
            alert(c.data)
        })*/
    }

    const testButton = () => {
        api.post('image/test', {bookDescription: {imageCount: 3}, user_id: getUserId()}).then(r=>{
            if(!r) return
            console.log('gone through', r.data)

            alert(r.data)
        })
    }

    const showEdition = (e) => {
        if(e.target === e.currentTarget) setEditionVisible(true) //check whether it is this component triggering and not a child trigger bubbling up
    }

    const showTips = () => {
        setTipsVisible(!tipsVisible)
    }

    const usedCredits = () => <div>Cost:
        {creationParams.pageCount*(creationParams.option1?10:1)} credits
    </div>

    const updateParameter = param => value => setCreationParams({...creationParams, [param]: value})

    const editionForm = () => {
        const loadingPage = <>Loading <div className="loader"></div></>
        const editionPage = <div style={{width:'100vw', height:'100vh'}}>
            <FlipBook title={creationParams.description} pages_directory={''} pages={pages}/>
        </div>

        return <div className={'edition-container'}>
            {pages.length===0 ? loadingPage : editionPage}
        </div>
    }

    const creationForm = () =><div className={'creation-container'}>
{/*
        <UI_Button button_text={t('creation.tips_button')} help_button={true} callbackFunction={showTips}/>
*/}
        <div className={`creation-form ${!creationVisible ? 'slide-up' : ''}`} onTransitionEnd={showEdition}>
            <InputField updateValue={updateParameter('description')} width={'40vw'} placeholder_text={t('creation.placeholder1')}/>
            <div className={"switches-container"}>
                <div><UI_Switch updateValue={updateParameter('option1')}/> <span className={'switch-caption'}>{t('creation.option1')}</span></div>
                <div><UI_Switch updateValue={updateParameter('option2')}/> <span className={'switch-caption'}>{t('creation.option2')}</span></div>
                <div className="number-input-container">
                    <NumberInput updateValue={updateParameter('pageCount')}/>
                    <div className="cost-container">
                        <span className="cost-text">{usedCredits()}</span>
                    </div>
                </div>
                <UI_Button button_text={t('creation.create')} callbackFunction={createBook}/>
            </div>
        </div>
        <CreationTips visible={tipsVisible} setVisible={setTipsVisible}/>
    </div>

    return editionVisible?editionForm():creationForm()
}
export default BookCreation;
