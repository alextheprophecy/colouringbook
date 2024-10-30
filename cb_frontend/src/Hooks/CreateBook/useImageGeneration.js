import api from '../../Hooks/ApiHandler';
import { useSelector } from 'react-redux';

const useImageGeneration = () => {
    const { currentContext, bookId, currentPage } = useSelector(state => state.book);

    const generateImage = async (description, creationSettings) => {
        if (!description || description.trim() === '') {
            throw new Error('No description found');
        }            
        
        try {            
            const response = await api.post('image/generatePageWithContext', {
                sceneDescription: description, 
                currentContext, 
                bookId, 
                ...creationSettings
            });
            const { updatedContext, ...pageData } = response.data;
            return { ...pageData, updatedContext };  
        } catch (error) {
            console.error('Error generating page:', error);
            throw error;
        }
    };

    const regenerateImage = async (detailedDescription, creationSettings) => {
        if (!detailedDescription || detailedDescription.trim() === '') {
            throw new Error('No detailed description found');
        }            

        try {            
            const response = await api.post('image/regeneratePage', {
                detailedDescription, 
                bookId, 
                currentPage: currentPage-1,
                ...creationSettings
            });
            const { image, seed } = response.data;
            return { image, seed };  
        } catch (error) {
            console.error('Error regenerating page:', error);
            throw error;
        }
    };

    const enhanceImage = async (currentDescription, userModifications, currentContext, creationSettings, currentPage) => {
        if (!currentDescription || !userModifications) {
            throw new Error('Missing required parameters for enhancement');
        }

        try {
            const response = await api.post('image/enhancePage', {
                previousDescription: currentDescription,
                enhancementRequest: userModifications,
                bookId,
                currentContext,
                currentPage: currentPage-1,
                ...creationSettings
            });

            return response.data;
        } catch (error) {
            console.error('Error enhancing image:', error);
            throw error;
        }
    };

    return { generateImage, regenerateImage, enhanceImage };
};

export default useImageGeneration;
