import { useState } from 'react';
import { useDispatch } from 'react-redux';
import useLoadRequest from './useLoadRequest';
import { addPage } from '../../redux/bookSlice';
import useImageGeneration from './useImageGeneration';

const useCreatePage = () => {
    const dispatch = useDispatch();
    const [description, setDescription] = useState('');
    const { generateImage } = useImageGeneration();
    const { loadRequest } = useLoadRequest();

    const handleDescriptionChange = (e) => setDescription(e.target.value);

    const createImage = async () => {
        alert(description);
        /* if (description.trim() !== '') {
            try {
                const { image, detailedDescription } = await loadRequest(() => generateImage(description), "Creating image...");
                dispatch(addPage({ image: image, user_description: description, detailed_description: detailedDescription }));
                return true;
            } catch (error) {
                console.error('Error generating image:', error);
                return false;
            }
        } */
        // alert('Please enter a description');
    };

    return {
        description,
        handleDescriptionChange,
        createImage,
    };
};

export default useCreatePage;
