import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useLoadRequest from './useLoadRequest';
import { creatingPage } from '../../redux/bookSlice';
import { addNotification } from '../../redux/websiteSlice';
import useImageGeneration from './useImageGeneration';
import { useTranslation } from 'react-i18next';

const useCreatePage = () => {
    const dispatch = useDispatch();
    const [description, setDescription] = useState('');
    const { generateImage } = useImageGeneration();
    const { loadRequest } = useLoadRequest();
    const { isBookFinished, currentContext, bookId, pages, seeds } = useSelector(state => state.book);
    const { usingModel } = useSelector(state => state.website.settings);
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
            dispatch(creatingPage());
            /* const lastPage = pages[pages.length - 1];
            const lastSeed = pages[0]?.seed //lastPage?.seed; TODO: handling the seed to use for new image, regenerations, etc */
            
            const modelKey = Object.keys(seeds)[usingModel];
            const lastSeed = seeds[modelKey];//currently just fetching the last seed for the model in use
            await loadRequest(
                () => generateImage(description, currentContext, bookId, lastSeed),
                t('creation.hooks.creating-image')
            )
        } catch (error) {
            console.error('Error generating page:', error);
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

