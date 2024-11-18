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
                className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-600/20 hover:bg-blue-600/30 transition-all duration-200"
            >
                <Globe className="w-5 h-5 text-blue-500" />
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