import { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updatePage, setIsEditing } from '../../redux/bookSlice';
import useImageGeneration from './useImageGeneration';
import useLoadRequest from './useLoadRequest';

const useEditPage = () => {
    const dispatch = useDispatch();
    const { pages, currentPage, isEditing } = useSelector(state => state.book);
    const [editText, setEditText] = useState('');
    const [isVisible, setIsVisible] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const [currentImage, setCurrentImage] = useState('');
    const [showDescription, setShowDescription] = useState(false);
    const [sceneDescription, setSceneDescription] = useState(['No user description available', 'No detailed description available']);
    const { regenerateImage, enhanceImage } = useImageGeneration();
    const [isLoading, setIsLoading] = useState(false);
    const { loadRequest} = useLoadRequest();

    const [isEnhancing, setIsEnhancing] = useState(false);

    const formatPageDescription = (pageData) => {
        if (!pageData) return ['No user description available', 'No detailed description available'];
        const formattedUserDescription = pageData?.user_description?.replace(/(\n\n)/g, '\n');
        const formattedDetailedDescription = pageData?.detailed_description?.replace(/(\n\n)/g, '\n');
        console.log('here are the descriptions', formattedUserDescription, formattedDetailedDescription, pageData);
        return [formattedUserDescription, formattedDetailedDescription];
    }

    useEffect(() => {
        if (isEditing && !isClosing) {
            setShowDescription(false);
            setSceneDescription(formatPageDescription(pages[currentPage]));
            setCurrentImage(pages[currentPage]?.image || '');
            setTimeout(() => setIsVisible(true), 50);
        } else if (!isEditing && !isClosing) {
            handleClose();
        }
    }, [isEditing, currentPage, pages, isClosing]);

    const handleClose = useCallback(() => {
        if (!isClosing) {
            setIsClosing(true);
            setIsVisible(false);
            setIsEnhancing(false);
            setTimeout(() => {
                dispatch(setIsEditing(false));
                setIsClosing(false);
            }, 300);
        }
    }, [dispatch, isClosing]);

    const handleEnhance = useCallback(() => {
        alert('Not implemented yet');
    }, []);

    const handleRegenerate = useCallback(async () => {
        const detailedDescription = pages[currentPage]?.detailed_description;
        if (!detailedDescription) {
            alert('No detailed description found');
            return false;
        }
        console.log('Regenerating image...', detailedDescription);
        try {
            console.log('Regenerating image...');
            const image = await loadRequest(() => regenerateImage(detailedDescription), "Regenerating image...");
            dispatch(updatePage({index: currentPage, data: { image }}));
            return true;
        } catch (error) {
            console.error('Error regenerating image:', error);
            return false;
        } finally {
            setIsLoading(false);
            handleClose();
        }      
    }, [currentPage, pages]);

    return {
        editText,
        setEditText,
        isVisible,
        isClosing,
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
