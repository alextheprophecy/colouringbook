import { useState, React } from "react";
import { useTranslation } from "react-i18next";
import { Globe } from "lucide-react";

const locales = {
    en: { title: 'English' },
    fr: { title: 'Francais' },
    de: { title: 'Deutsch' },
    it: { title: 'Italiano' },
    es: { title: 'Español' },
};

const LanguageChange = () => {
    const { i18n } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = () => setIsOpen(!isOpen);

    return (
        <div className="relative">
            <button
                onClick={toggleDropdown}
                className="language-button bg-blue-500 hover:bg-blue-600 text-white rounded-full p-2"
            >
                <Globe className="w-6 h-6" />
            </button>
            {isOpen && (
                <div className="absolute top-12 left-0 bg-white shadow-lg rounded-md z-[100]">
                    {Object.keys(locales).map((locale) => (
                        <button
                            key={locale}
                            onClick={() => {
                                i18n.changeLanguage(locale);
                                setIsOpen(false);
                            }}
                            className={`block px-4 py-2 text-left w-full hover:bg-gray-100 ${
                                i18n.resolvedLanguage === locale
                                    ? 'bg-blue-600 text-white'
                                    : 'text-gray-800'
                            }`}
                        >
                            {locales[locale].title}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default LanguageChange;