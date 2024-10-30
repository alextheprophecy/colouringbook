import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useLoadRequest from './useLoadRequest';
import { addPage, updateContext } from '../../redux/bookSlice';
import { addNotification } from '../../redux/websiteSlice';
import useImageGeneration from './useImageGeneration';

const useCreatePage = (creationSettings) => {
    const dispatch = useDispatch();
    const [description, setDescription] = useState('');
    const { generateImage } = useImageGeneration();
    const { loadRequest } = useLoadRequest();
    // Add selector to get isBookFinished state
    const isBookFinished = useSelector(state => state.book.isBookFinished);

    const handleDescriptionChange = (e) => setDescription(e.target.value);

    const createImage = async () => {
        if (isBookFinished) {
            dispatch(addNotification({
                type: 'error',
                message: 'Cannot create new pages: Book is finished',
                duration: 3000
            }));
            return false;
        }
        
        if (!description.trim()) {
            dispatch(addNotification({
                type: 'error',
                message: 'Please enter a description for your page',
                duration: 3000
            }));
            return false;
        }

        try {
            const { detailedDescription, updatedContext, ...imageSeedAndRest} = await loadRequest(
                () => generateImage(description, creationSettings), 
                "Creating image..."
            );
            dispatch(addPage({user_description: description, detailed_description: detailedDescription, ...imageSeedAndRest}));
            dispatch(updateContext(updatedContext));
            return true;
        } catch (error) {
            console.error('Error generating image:', error);
            dispatch(addNotification({
                type: 'error',
                message: error.message || 'Failed to generate image. Please try again.',
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

