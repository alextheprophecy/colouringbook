import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useLoadRequest from './useLoadRequest';
import { addPage, updateContext} from '../../redux/bookSlice';
import useImageGeneration from './useImageGeneration';

const useCreatePage = () => {
    const dispatch = useDispatch();
    const [description, setDescription] = useState('');
    const { generateImage } = useImageGeneration();
    const { loadRequest } = useLoadRequest();
    // Add selector to get isBookFinished state
    const isBookFinished = useSelector(state => state.book.isBookFinished);

    const handleDescriptionChange = (e) => setDescription(e.target.value);

    const createImage = async () => {
        // Add check for isBookFinished
        if (isBookFinished) {
            console.error('Cannot create new pages: Book is finished');
            return false;
        }

        if (description.trim() !== '') {
            try {
                const { image, detailedDescription, seed, updatedContext} = await loadRequest(() => generateImage(description), "Creating image...");
                dispatch(addPage({ image: image, user_description: description, detailed_description: detailedDescription, seed }));
                dispatch(updateContext(updatedContext));
                return true;
            } catch (error) {
                console.error('Error generating image:', error);
                return false;
            }
        }
    };

    return {
        description,
        handleDescriptionChange,
        createImage,
    };
};

export default useCreatePage;
