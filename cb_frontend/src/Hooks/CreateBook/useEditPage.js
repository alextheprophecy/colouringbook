import { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setIsEditing} from '../../redux/bookSlice';
import useImageGeneration from './useImageGeneration';
import useLoadRequest from './useLoadRequest';
import { addNotification } from '../../redux/websiteSlice';
import { useTranslation } from 'react-i18next';
const useEditPage = () => {
    const dispatch = useDispatch();
    const { pages, workingOnPage, isEditing, currentContext, bookId } = useSelector(state => state.book);
    const creationSettings = useSelector(state => state.website.settings);
    const [editText, setEditText] = useState('');
    const [isVisible, setIsVisible] = useState(false);
    const [currentImage, setCurrentImage] = useState('');
    const [showDescription, setShowDescription] = useState(false);
    const [sceneDescription, setSceneDescription] = useState(['No user description available', 'No detailed description available']);
    const { regenerateImage, enhanceImage } = useImageGeneration();
    const { loadRequest} = useLoadRequest();
    const { t } = useTranslation();
    const [isEnhancing, setIsEnhancing] = useState(false);

    const formatPageDescription = (pageData) => {
        if (!pageData) return ['No user description available', 'No detailed description available'];
        const formattedUserDescription = pageData?.userDescription?.replace(/(\n\n)/g, '\n');
        const formattedDetailedDescription = pageData?.detailedDescription?.replace(/(\n\n)/g, '\n');
        const compositionIdea = pageData?.compositionIdea || 'No composition idea available';
        return [formattedUserDescription, formattedDetailedDescription, pageData.seed || '', currentContext || null, compositionIdea];
    }

    const handleClose = useCallback(() => {
        setEditText('');
        setIsVisible(false);
        setIsEnhancing(false);
        dispatch(setIsEditing(false));
    }, [dispatch]);

    
    useEffect(() => {
        if (isEditing) {
            //open the edit page
            setShowDescription(false);
            setSceneDescription(formatPageDescription(pages[workingOnPage]));
            setCurrentImage(pages[workingOnPage]?.image || '');
            setIsVisible(true)
        } else {
            handleClose();
        }
    }, [isEditing, workingOnPage, pages, bookId]);

    
    const handleRegenerate = useCallback(async () => {
        handleClose();
        try {
            await loadRequest(
                () => regenerateImage(workingOnPage, pages, currentContext, bookId),
                t('edition.hooks.regenrating-image')
            )
        } catch (error) {
            return false;
        }         
    }, [workingOnPage, bookId, currentContext, pages, creationSettings]);


    const handleEnhance = useCallback(async () => {
        handleClose();
        if (!editText.trim()) {
            dispatch(addNotification({
                type: 'error',
                message: t('error.please-enter-enhancement-instructions'),
                duration: 3000
            }));
            return;
        }
        try {
            await loadRequest(
                () => enhanceImage(editText, workingOnPage, pages, currentContext, bookId),
                t('edition.hooks.enhancing-description')
            )
        } catch (error) {
            return false;
        }
    }, [editText, workingOnPage, bookId, currentContext, pages]);

    return {
        editText,
        setEditText,
        isVisible,
        currentImage,
        handleClose,
        showDescription,
        setShowDescription,
        sceneDescription,
        isEnhancing,
        setIsEnhancing,
        handleEnhance,
        handleRegenerate
    };
};

export default useEditPage;
