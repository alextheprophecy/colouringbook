import api from '../../Hooks/ApiHandler'; // Assuming you have an API handler for making requests
import { updateContext } from '../../redux/bookSlice';
import { useSelector, useDispatch } from 'react-redux';

const useImageGeneration = () => {
    const { currentContext} = useSelector(state => state.book);
    const dispatch = useDispatch(); // Added dispatch definition

    const generateImage = async (description) => {
        try {
            console.log('generateImage called with:', description, currentContext);
            console.log('response:', description, currentContext);
            
            const response = await api.post('image/generatePageWithContext', {sceneDescription: description, currentContext});
            const { updatedContext, ...pageData } = response.data;
            console.log('created page with:', pageData, ' and updated context:', updatedContext);

            dispatch(updateContext(updatedContext));
            return pageData;  

        } catch (error) {
            console.error('Error generating page:', error);
            alert(`Error generating page: ${error}`);
        }
    };

    const regenerateImage = async (description) => {
        // Simulate a different seed by appending a random number
        const response = await new Promise(resolve => 
            setTimeout(() => resolve({ 
                image: `https://placehold.co/400x600/${Math.floor(Math.random()*16777215).toString(16)}/000000?text=${description}&seed=${Math.random()}`,
                detailedDescription: `Updated detailed description for: ${description}`
            }), 1500)
        );
        console.log('regenerateImage called with:', { description });
        return response;
    };

    const enhanceImage = async (currentDescription, userModifications) => {
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
