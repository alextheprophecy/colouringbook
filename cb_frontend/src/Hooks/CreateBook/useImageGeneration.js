import api from '../../Hooks/ApiHandler';
import { useSelector, useDispatch } from 'react-redux';
import { addPage, updateContext, updatePage, setSeeds } from '../../redux/bookSlice';

const useImageGeneration = () => {
    const dispatch = useDispatch();
    const {workingOnPage} = useSelector(state => state.book);
    const creationSettings = useSelector(state => state.website.settings);

    const generateImage = async (description, currentContext, bookId, seed=null) => {
        if (!description || description.trim() === '') throw new Error('No description found');
                                     
        /* const response = await api.post('image/generatePageWithContext', {
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

        if(creationSettings.useAdvancedModel){
            dispatch(setSeeds({
                advanced: imageSeedAndRest.seed
            }));    
        } else {
            dispatch(setSeeds({
                fineTuned: imageSeedAndRest.seed,
            }));    
        }
         */
        const imageSeedAndRest = {
            seed: 1234567890,
            detailedDescription: 'A detailed description of the image',
            image: `https://placehold.co/400x600/${Math.floor(Math.random()*16777215).toString(16)}/000000?text=P${workingOnPage}`
        };
        await new Promise(resolve => setTimeout(resolve, 2500));

        dispatch(addPage({
            userDescription: description, 
            detailedDescription: imageSeedAndRest.detailedDescription, 
            ...imageSeedAndRest
        }));

        //return dispatch(updateContext(updatedContext));        
    }

    const regenerateImage = async (currentPage, pages, currentContext, bookId) => {
        console.log('regenerating image', currentPage, pages);
        console.log('Context', currentContext);     
        const detailedDescription = pages[currentPage]?.detailedDescription;
        if (!detailedDescription) throw new Error('No detailed description found');
        /* const response = await api.post('image/regeneratePage', {
            detailedDescription, 
            bookId, 
            currentPage: currentPage-1,
            ...creationSettings
        });
        const { image, seed } = response.data; */
        const image = `https://placehold.co/400x600/${Math.floor(Math.random()*16777215).toString(16)}/000000?text=P${workingOnPage}`
        await new Promise(resolve => setTimeout(resolve, 2500));
        return dispatch(updatePage({index: workingOnPage, data: { image, seed: 6 }, isRegeneration: true}));
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
            currentPage: currentPage-1,
            ...creationSettings,
            seed: currentSeed
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
