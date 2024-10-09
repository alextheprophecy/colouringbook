import {useTranslation} from "react-i18next";
import '../../Styles/Creation/creation_tips.css'
import {useState} from "react";
const CreationTips = ({setVisible, visible}) => {
    const {t} = useTranslation()

    const regex = /(?=\[do])|\[\/do]|(?=\[avoid])|\[\/avoid]/g;

    function formatText(text) {
        return text.split(regex).map((str, index) => {
            // Handle [do] tags
            if (str.startsWith('[do]')) {
                return <span className="tips-do"><br/>-> {str.substring(4)}</span>;
            }
            // Handle [avoid] tags
            if (str.startsWith('[avoid]')) {
                return <span className="tips-avoid"><br/>{str.substring(7)}</span>;
            }
            // Return plain text
            return <span className="tips-normal-text">{str}</span>;
        });
    }

    return <div className={`creation-tips-container ${visible?'show-up':'hide-up'}`} onClick={() => setVisible(false)}>
        <span className={'tips-container'}>
            <span className={'tips-text'}>{formatText(t('creation.tips1'))}</span>
            <span className={'tips-text'}>{formatText(t('creation.tips2'))}</span>
            <span className={'tips-text'}>{formatText(t('creation.tips3'))}</span>
            <span className={'tips-text'}>{formatText(t('creation.tips4'))}</span>
            <span className={'tips-text'}>{formatText(t('creation.tips5'))}</span>
        </span>
        <span className={'bottom-tool-tip'}>{t('creation.tips_close_button')}</span>
    </div>
}

export default CreationTips