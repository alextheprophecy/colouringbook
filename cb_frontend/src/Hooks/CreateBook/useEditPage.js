import { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updatePage, setIsEditing } from '../../redux/bookSlice';

const useEditPage = () => {
    const dispatch = useDispatch();
    const { pages, currentPage, isEditing } = useSelector(state => state.book);
    const [editText, setEditText] = useState('');
    const [isVisible, setIsVisible] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const [currentImage, setCurrentImage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showDescription, setShowDescription] = useState(false);
    const [sceneDescription, setSceneDescription] = useState('');
    const [showEditOptions, setShowEditOptions] = useState(true);
    const [editMode, setEditMode] = useState('');

    useEffect(() => {
        if (isEditing && !isClosing) {
            // on open
            setShowDescription(false);
            setSceneDescription(pages[currentPage]?.description || '');
            setCurrentImage(pages[currentPage]?.image || '');
            setTimeout(() => setIsVisible(true), 50); // Slight delay before showing
        } else if (!isEditing && !isClosing) {
            handleClose();
        }
    }, [isEditing, currentPage, pages]);

    const handleEditOption = (mode) => {
        setEditMode(mode);
        setShowEditOptions(false);
        if (mode === 'modify') {
            setEditText(sceneDescription);
        } else {
            setEditText('');
        }
    };

    const handleClose = useCallback(() => {
        if (!isClosing) {
            setIsClosing(true);
            setIsVisible(false);
            setShowEditOptions(true); // Reset to show options
            setTimeout(() => {
                dispatch(setIsEditing(false));
                setIsClosing(false);
            }, 300); // Match this with the CSS transition duration
        }
    }, [dispatch, isClosing]);

    const handleSubmit = useCallback(async () => {
        if (editText.trim() !== '') {
            setIsLoading(true);
            try {
                // Replace this with your actual API call
                const response = await new Promise(resolve => 
                    setTimeout(() => resolve({ newImage: `https://placehold.co/400x600?text=${editText}` }), 1500)
                );
                
                dispatch(updatePage({ 
                    index: currentPage, 
                    data: { 
                        image: response.newImage, 
                        description: editText 
                    } 
                }));
                dispatch(setIsEditing(false));
                setShowEditOptions(true); // Reset to show options
            } catch (error) {
                console.error('Error generating image:', error);
                // Handle error (e.g., show error message to user)
            } finally {
                setIsLoading(false);
            }
        }
    }, [editText, currentPage, dispatch]);

    return {
        editText,
        setEditText,
        isVisible,
        isClosing,
        currentImage,
        isLoading,
        handleClose,
        handleSubmit,
        showDescription,
        setShowDescription,
        sceneDescription,
        showEditOptions,
        handleEditOption,
        editMode
    };
};

export default useEditPage;
