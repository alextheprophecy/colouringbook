import { useState } from 'react';
import { useDispatch } from 'react-redux';
import useLoadRequest from './useLoadRequest';
import { addPage } from '../../redux/bookSlice';
import useImageGeneration from './useImageGeneration';

const useCreatePage = () => {
    const dispatch = useDispatch();
    const [description, setDescription] = useState('');
    const { generateImage } = useImageGeneration();
    const { loadRequest} = useLoadRequest();

    const handleDescriptionChange = (event) => setDescription(event.target.value);

    const createImage = async () => {
        if (description.trim() !== '') {
            try {
                const { newImage, detailedDescription } = await loadRequest(() => generateImage(description), "Creating image...");
                dispatch(addPage({ image: newImage, user_description: description, detailed_description: detailedDescription }));
            } catch (error) {
                console.error('Error generating image:', error);
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
