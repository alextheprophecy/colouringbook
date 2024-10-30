import api from '../../Hooks/ApiHandler'; // Assuming you have an API handler for making requests
import { useSelector, useDispatch } from 'react-redux';

const useImageGeneration = () => {
    const { currentContext, bookId, currentPage } = useSelector(state => state.book);

    const generateImage = async (description, testMode = false, useCreativeModel = false) => {
        if (!description || description.trim() === '') return console.error('No description found');            
        
        try {            
            const response = await api.post('image/generatePageWithContext', {
                sceneDescription: description, 
                currentContext, 
                bookId, 
                testMode,
                useCreativeModel
            });
            const { updatedContext, ...pageData } = response.data;
            return { ...pageData, updatedContext };  
        } catch (error) {
            console.error('Error generating page:', error);
            alert(`Error generating page: ${error}`);
        }
    };

    const regenerateImage = async (detailedDescription) => {
        if (!detailedDescription || detailedDescription.trim() === '') return console.error('No detailedDescription found');            

        try {            
            console.log('regenerating image with:', JSON.stringify({detailedDescription, bookId, currentPage: currentPage-1}));
            const response = await api.post('image/regeneratePage', {detailedDescription, bookId, currentPage: currentPage-1}); //currentPage is 1-indexed (first page is cover)
            const { image, seed } = response.data;
            return { image, seed };  

        } catch (error) {
            console.error('Error generating page:', error);
            alert(`Error generating page: ${error}`);
        }
    };

    const enhanceImage = async (currentDescription, userModifications) => {
        if (!currentDescription || !userModifications || currentDescription.trim() === '') return console.error('No currentDescription found');            

        // Combine current description with user modifications
        const combinedDescription = `${currentDescription}. Modifications: ${userModifications}`;
        const response = await new Promise(resolve => 
            setTimeout(() => resolve({ 
                image: `https://placehold.co/400x600/${Math.floor(Math.random()*16777215).toString(16)}/000000?text=${combinedDescription}`,
                description:'update simple description',
                detailedDescription: `Enhanced detailed description for: ${combinedDescription}`
            }), 1500)
        );
        console.log('enhanceImage called with:', { currentDescription, userModifications });
        return response;
    };

    return { generateImage, regenerateImage, enhanceImage };
};

export default useImageGeneration;
