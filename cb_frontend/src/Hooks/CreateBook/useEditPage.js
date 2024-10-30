import { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updatePage, setIsEditing } from '../../redux/bookSlice';
import useImageGeneration from './useImageGeneration';
import useLoadRequest from './useLoadRequest';

const useEditPage = () => {
    const dispatch = useDispatch();
    const { pages, currentPage, isEditing, currentContext } = useSelector(state => state.book);
    const [editText, setEditText] = useState('');
    const [isVisible, setIsVisible] = useState(false);
    const [currentImage, setCurrentImage] = useState('');
    const [showDescription, setShowDescription] = useState(false);
    const [sceneDescription, setSceneDescription] = useState(['No user description available', 'No detailed description available', 0]);
    const { regenerateImage, enhanceImage } = useImageGeneration();
    const [isLoading, setIsLoading] = useState(false);
    const { loadRequest} = useLoadRequest();

    const [isEnhancing, setIsEnhancing] = useState(false);

    const formatPageDescription = (pageData) => {
        console.log('pageData:', pageData.currentContext);
        if (!pageData) return ['No user description available', 'No detailed description available'];
        const formattedUserDescription = pageData?.user_description?.replace(/(\n\n)/g, '\n');
        const formattedDetailedDescription = pageData?.detailed_description?.replace(/(\n\n)/g, '\n');
        const compositionIdea = pageData?.compositionIdea || 'No composition idea available';
        console.log('here are the descriptions', formattedUserDescription, formattedDetailedDescription, pageData);
        return [formattedUserDescription, formattedDetailedDescription, pageData.seed || '', currentContext || null, compositionIdea];
    }

    const handleClose = useCallback(() => {
        setIsVisible(false);
        setIsEnhancing(false);
        dispatch(setIsEditing(false));
    }, [dispatch]);

    
    useEffect(() => {
        if (isEditing) {
            //open the edit page
            setShowDescription(false);
            setSceneDescription(formatPageDescription(pages[currentPage]));
            setCurrentImage(pages[currentPage]?.image || '');
            setIsVisible(true)
        } else {
            handleClose();
        }
    }, [isEditing, currentPage, pages, handleClose]);

    const handleEnhance = useCallback(() => {
        alert('Not implemented yet');
    }, []);

    const handleRegenerate = useCallback(async () => {
        const detailedDescription = pages[currentPage]?.detailed_description;
        if (!detailedDescription) return alert('No detailed description found');
        
        console.log('Regenerating image...', detailedDescription);
        try {
            console.log('Regenerating image...');
            const {image, seed} = await loadRequest(() => regenerateImage(detailedDescription), "Regenerating image...");
            dispatch(updatePage({index: currentPage, data: { image, seed }}));
            return true;
        } catch (error) {
            console.error('Error regenerating image:', error);
            return false;
        } finally {
            setIsLoading(false);
            handleClose();
        }      
    }, [currentPage, pages, handleClose]);

    return {
        editText,
        setEditText,
        isVisible,
        currentImage,
        isLoading,
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
