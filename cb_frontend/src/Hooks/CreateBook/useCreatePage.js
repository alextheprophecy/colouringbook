import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useLoadRequest from './useLoadRequest';
import { addPage, updateContext, setSeeds, workOnPage } from '../../redux/bookSlice';
import { addNotification } from '../../redux/websiteSlice';
import useImageGeneration from './useImageGeneration';
import { useTranslation } from 'react-i18next';

const useCreatePage = () => {
    const dispatch = useDispatch();
    const [description, setDescription] = useState('');
    const { generateImage } = useImageGeneration();
    const { loadRequest } = useLoadRequest();
    const { isBookFinished, currentContext, bookId, pages, seeds } = useSelector(state => state.book);
    const { useAdvancedModel } = useSelector(state => state.website.settings);
    const { t } = useTranslation();
    const handleDescriptionChange = (e) => setDescription(e.target.value);

    const createImage = async () => {
        if (isBookFinished) {
            dispatch(addNotification({
                type: 'error',
                message: t('error.cannot-create-new-pages-book-is-finished'),
                duration: 3000
            }));
            return false;
        }
        
        if (!description.trim()) {
            dispatch(addNotification({
                type: 'error',
                message: t('creation.hooks.please-enter-a-description-for-your-page'),
                duration: 3000
            }));
            return false;
        }

        try { 
            dispatch(workOnPage(pages.length));
            /* const lastPage = pages[pages.length - 1];
            const lastSeed = pages[0]?.seed //lastPage?.seed; TODO: handling the seed to use for new image */
            const lastSeed = useAdvancedModel ? seeds.advanced : seeds.fineTuned;
            
            await loadRequest(
                () => generateImage(description, currentContext, bookId, lastSeed),
                t('creation.hooks.creating-image')
            )
        } catch (error) {
            console.error('Error generating page:', error);
            dispatch(addNotification({
                type: 'error',
                message: error.message || t('creation.hooks.failed-to-generate-image-please-try-again'),
                duration: 5000
            }));
            return false;
        }
    };

    return {
        description,
        handleDescriptionChange,
        createImage,
    };
};

export default useCreatePage;

