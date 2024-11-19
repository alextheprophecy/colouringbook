import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toggleSetting } from '../../../redux/websiteSlice';
import { useTranslation } from 'react-i18next';
import { ChevronDown } from 'lucide-react';
import { getModelOptions } from '../../../Constants/qualityOptions';
const ImageQualityOptions = ({ isVisible = true }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const settings = useSelector((state) => state.website.settings);

    const qualityOptions = getModelOptions(t);

    return (
        <div className={`p-3 w-full max-w-md bg-white/80 rounded-lg shadow-md hover:shadow-lg 
            transition-all duration-200 ring-1 ring-blue-100 
            ${!isVisible ? 'scale-0 pointer-events-none absolute' : 'scale-100 relative'}`}
        >
            <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                    <span className="text-lg font-children font-semibold text-gray-700">
                        {t('modifybook.image_quality')}
                    </span>
                    <div className="relative min-w-[120px]">
                        <select
                            value={settings.usingModel}
                            onChange={(e) => dispatch(toggleSetting({model: e.target.value}))}
                            className="w-full px-3 py-1 bg-amber-100 rounded-lg border border-amber-200 border-b-4 font-children
                                appearance-none cursor-pointer font-semibold tracking-wider
                                text-black text-sm
                                focus:outline-none focus:border-transparent"
                        >
                            {qualityOptions.map((option) => (
                                <option key={option.id} value={option.id}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none w-4 h-4" />
                    </div>
                </div>
                <span className="text-sm text-gray-500  w-full block">
                    {qualityOptions[settings.usingModel].description}
                </span>
            </div>
        </div>
    );
};

export default ImageQualityOptions;
