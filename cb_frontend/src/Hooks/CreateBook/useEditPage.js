import { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updatePage, setIsEditing } from '../../redux/bookSlice';
import useImageGeneration from './useImageGeneration';
import { EditOptions } from '../../constants/editOptions';
import useLoadRequest from './useLoadRequest';

const useEditPage = () => {
    const dispatch = useDispatch();
    const { pages, currentPage, isEditing } = useSelector(state => state.book);
    const [editText, setEditText] = useState('');
    const [isVisible, setIsVisible] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const [currentImage, setCurrentImage] = useState('');
    const [showDescription, setShowDescription] = useState(false);
    const [sceneDescription, setSceneDescription] = useState('');
    const [showEditOptions, setShowEditOptions] = useState(true);
    const [editMode, setEditMode] = useState('');
    const { generateImage, enhanceImage } = useImageGeneration();
    const [isLoading, setIsLoading] = useState(false);
    const { loadRequest} = useLoadRequest();

    useEffect(() => {
        if (isEditing && !isClosing) {
            setShowDescription(false);
            setSceneDescription(pages[currentPage]?.description || '');
            setCurrentImage(pages[currentPage]?.image || '');
            setTimeout(() => setIsVisible(true), 50);
        } else if (!isEditing && !isClosing) {
            handleClose();
        }
    }, [isEditing, currentPage, pages]);

    const handleEditOption = (mode) => {
        setEditMode(mode);
        setShowEditOptions(false);
        if (mode === EditOptions.MODIFY) setEditText('');
        else setEditText(sceneDescription);
    };

    const handleClose = useCallback(() => {
        if (!isClosing) {
            setIsClosing(true);
            setIsVisible(false);
            setShowEditOptions(true);
            setTimeout(() => {
                dispatch(setIsEditing(false));
                setIsClosing(false);
            }, 300);
        }
    }, [dispatch, isClosing]);

    const handleSubmit = useCallback(async () => {
        if (editText.trim() !== '') {
            setIsLoading(true);
            try {
                let newImage, detailedDescription;
                if (editMode === EditOptions.MODIFY) 
                    ({ newImage, detailedDescription } = await loadRequest(() => enhanceImage(sceneDescription, editText), "Enhancing image..."));
                else 
                    ({ newImage, detailedDescription } = await loadRequest(() => generateImage(editText), "Creating a new scene for page " + (currentPage)));            

                dispatch(updatePage({ 
                    index: currentPage, 
                    data: { 
                        image: newImage, 
                        description: editText,
                        detailed_description: detailedDescription
                    } 
                }));
                dispatch(setIsEditing(false));
                setShowEditOptions(true);
            } catch (error) {
                console.error('Error generating image:', error);
            } finally {
                setIsLoading(false);
            }
        }
    }, [editText, currentPage, dispatch, generateImage, enhanceImage, editMode, sceneDescription]);

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
