import api from '../../Hooks/ApiHandler';
import { useSelector, useDispatch } from 'react-redux';
import { addPage, updateContext, updatePage } from '../../redux/bookSlice';
import { addNotification } from '../../redux/websiteSlice';
import { useCallback } from 'react';

const useImageGeneration = () => {
    const dispatch = useDispatch();
    const creationSettings = useSelector(state => state.website.settings);

    const generateImage = async (description, currentContext, bookId, seed=null) => {
        if (!description || description.trim() === '') {
            throw new Error('No description found');
        }                             
        const response = await api.post('image/generatePageWithContext', {
            sceneDescription: description,  
            currentContext, 
            bookId,
            seed,
            ... creationSettings
        });        
        const { detailedDescription, updatedContext, ...imageSeedAndRest } = response.data;
        console.log('NEW IMAGE', {
            userDescription: description, 
            detailedDescription, 
            ...imageSeedAndRest
        });
        dispatch(addPage({
            userDescription: description, 
            detailedDescription, 
            ...imageSeedAndRest
        }));

        return dispatch(updateContext(updatedContext));        
    }

    const regenerateImage = async (currentPage, pages, currentContext, bookId) => {   
        console.log('regenerating image', currentPage, pages);
        console.log('Context', currentContext);     
        const detailedDescription = pages[currentPage]?.detailedDescription;
        if (!detailedDescription) throw new Error('No detailed description found');
        const response = await api.post('image/regeneratePage', {
            detailedDescription, 
            bookId, 
            currentPage,
            ...creationSettings
        });
        const { image, seed } = response.data;
        
        return dispatch(updatePage({index: currentPage, data: { image, seed }}));
    }

    const enhanceImage = async (enhancementRequest, currentPage, pages, currentContext, bookId) => {        
        const currentDescription = pages[currentPage]?.detailedDescription;
        const currentSeed = pages[currentPage]?.seed;
        if (!currentDescription || !enhancementRequest) throw new Error('Missing required parameters for enhancement');
            
        const response = await api.post('image/enhancePage', {
            previousDescription: currentDescription,
            enhancementRequest,
            bookId,
            currentContext,                
            currentPage: currentPage,
            ...creationSettings,
            seed: currentSeed
        });
        const { enhancedDescription, updatedContext, image, seed } = response.data;

        console.log('NEW IMAGE', image, seed);
        dispatch(updatePage({
            index: currentPage,
            data: { 
                detailedDescription: enhancedDescription,
                enhancementRequest,
                image,
                seed
            }
        }));
        
        if(updatedContext) return dispatch(updateContext(updatedContext));       
        return true;
    }

    return { generateImage, regenerateImage, enhanceImage };
};

export default useImageGeneration;
