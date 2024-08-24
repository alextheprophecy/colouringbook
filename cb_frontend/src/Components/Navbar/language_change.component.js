import {useTranslation} from "react-i18next";
import '../../Styles/Navbar/language_change.css'

const locales = {
    en_gb: { title: 'English' },
    fr: { title: 'Francais' },
    de: { title: 'Deutsch' },
    it: { title: 'Italiano' },
    es: { title: 'Español' },
};

const LanguageChange = () => {
    const { t, i18n } = useTranslation();


    return <span className={'top-right language_buttons_container'}>
        {Object.keys(locales).map((locale) => (
            <div key={locale}><button style={{ fontWeight: i18n.resolvedLanguage === locale ? 'bold' : 'normal' }} type="submit" onClick={() => i18n.changeLanguage(locale)}>
                {locales[locale].title}
            </button></div>
        ))}</span>
}
export default LanguageChange