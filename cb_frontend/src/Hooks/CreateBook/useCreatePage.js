import { useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addPage } from '../../redux/bookSlice';

const useCreatePage = () => {
    const dispatch = useDispatch();
    const pages = useSelector(state => state.book.pages);
    const [description, setDescription] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleDescriptionChange = (event) => setDescription(event.target.value);

    const handleSubmit = useCallback(async () => {
        if (description.trim() !== '') {
            setIsLoading(true);
            try {
                // Replace this with your actual API call
                const response = await new Promise(resolve => 
                    setTimeout(() => resolve({ newImage:`https://placehold.co/400x600?text=${description}`}), 1500)
                );
                
                dispatch(addPage({ image: response.newImage, description }));
            } catch (error) {
                console.error('Error generating image:', error);
                // Handle error (e.g., show error message to user)
            } finally {
                setIsLoading(false);
            }
        }
    }, [description, dispatch, pages.length]);

    return {
        description,
        isLoading,
        handleDescriptionChange,
        handleSubmit
    };
};

export default useCreatePage;

