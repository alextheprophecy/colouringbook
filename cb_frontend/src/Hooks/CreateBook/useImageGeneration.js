import api from '../../Hooks/ApiHandler';
import { useSelector, useDispatch } from 'react-redux';
import { addPage, updateContext, updatePage, setSeed } from '../../redux/bookSlice';

const useImageGeneration = () => {
    const dispatch = useDispatch();
    const {workingOnPage, seeds} = useSelector(state => state.book);
    const creationSettings = useSelector(state => state.website.settings);

    const generateImage = async (description, currentContext, bookId) => {
        if (!description || description.trim() === '') throw new Error('No description found');

        const modelKey = Object.keys(seeds)[creationSettings.usingModel];
        const lastSeed = seeds[modelKey];//currently just fetching the last seed for the model in use
  
        const response = await api.post('image/generate', {
            sceneDescription: description,  
            currentContext, 
            bookId,
            creationSettings: {...creationSettings, seed: lastSeed}
        });        
        
        const { detailedDescription, updatedContext, ...imageSeedAndRest } = response.data;
        console.log('NEW IMAGE', {
            userDescription: description, 
            detailedDescription, 
            ...imageSeedAndRest
        });

        dispatch(setSeed({
            model: creationSettings.usingModel,
            seed: imageSeedAndRest.seed
        }));   
        
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
        const response = await api.post('image/regenerate', {
            detailedDescription, 
            bookId, 
            currentPage: currentPage-1,
            creationSettings
        });
        const { image, seed } = response.data;
        
        return dispatch(updatePage({index: workingOnPage, data: { image, seed }, isRegeneration: true}));
    }

    const enhanceImage = async (enhancementRequest, currentPage, pages, currentContext, bookId) => {        
        const currentDescription = pages[currentPage]?.detailedDescription;
        const currentSeed = pages[currentPage]?.seed || null;
        if (!currentDescription || !enhancementRequest) throw new Error('Missing required parameters for enhancement');
       

        const response = await api.post('image/enhance', {
            previousDescription: currentDescription,
            enhancementRequest,
            bookId,
            currentContext,                
            currentPage: currentPage-1,
            creationSettings : {...creationSettings, seed: currentSeed}
        });
        const { enhancedDescription, updatedContext, image, seed } = response.data;

        console.log('NEW IMAGE', image, seed);
        dispatch(updatePage({
            index: workingOnPage,
            data: { 
                detailedDescription: enhancedDescription,
                enhancementRequest,
                image,
                seed
            },
            isEnhancement: true
        }));
        
        if(updatedContext) return dispatch(updateContext(updatedContext));       
        return true;
    }

    return { generateImage, regenerateImage, enhanceImage };
};

export default useImageGeneration;
