import { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updatePage, setIsEditing, updateContext} from '../../redux/bookSlice';
import useImageGeneration from './useImageGeneration';
import useLoadRequest from './useLoadRequest';
import { addNotification } from '../../redux/websiteSlice';

const useEditPage = () => {
    const dispatch = useDispatch();
    const { pages, currentPage, isEditing, currentContext, bookId } = useSelector(state => state.book);
    const settings = useSelector(state => state.website.settings);
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
            setSceneDescription(formatPageDescription(pages[currentPage]));
            setCurrentImage(pages[currentPage]?.image || '');
            setIsVisible(true)
        } else {
            handleClose();
        }
    }, [isEditing, currentPage, pages, showDescription, bookId]);

    
    const handleRegenerate = useCallback(async () => {
        try {
            await loadRequest(
                () => regenerateImage(currentPage, pages, currentContext, bookId),
                "Regenrating image..."
            )
        } catch (error) {
            dispatch(addNotification({
                type: 'error',
                message: error.message || 'Failed to regenerate image. Please try again.',
                duration: 3000
            }));
            return false;
        } finally {
            handleClose();
        }             
    }, [currentPage, bookId, currentContext, pages]);


    const handleEnhance = useCallback(async () => {
        if (!editText.trim()) {
            dispatch(addNotification({
                type: 'error',
                message: 'Please enter enhancement instructions',
                duration: 3000
            }));
            return;
        }
        try {
            await loadRequest(
                () => enhanceImage(editText, currentPage, pages, currentContext, bookId),
                "Enhancing description..."
            )
        } catch (error) {
            dispatch(addNotification({
                type: 'error',
                message: error.message || 'Failed to enhance description. Please try again.',
                duration: 3000
            }));
        } finally {
            handleClose();   
        }
    }, [editText, currentPage, bookId, currentContext, pages]);

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
