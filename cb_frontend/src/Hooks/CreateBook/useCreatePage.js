import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useLoadRequest from './useLoadRequest';
import { addPage, updateContext } from '../../redux/bookSlice';
import { addNotification } from '../../redux/websiteSlice';
import useImageGeneration from './useImageGeneration';

const useCreatePage = () => {
    const dispatch = useDispatch();
    const [description, setDescription] = useState('');
    const { generateImage } = useImageGeneration();
    const { loadRequest } = useLoadRequest();
    const { isBookFinished, currentContext, bookId } = useSelector(state => state.book);

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
            await loadRequest(
                () => generateImage(description, currentContext, bookId),
                "Creating image..."
            )
        } catch (error) {
            console.error('Error generating page:', error);
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

