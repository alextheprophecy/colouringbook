import { useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updatePage } from '../../redux/bookSlice';
import useImageGeneration from './useImageGeneration';
import useLoadRequest from './useLoadRequest';

const usePagePreview = () => {
    const dispatch = useDispatch();
    const { pages, currentPage } = useSelector(state => state.book);
    const currentPageData = pages[currentPage];
    const { regenerateImage } = useImageGeneration();
    const { loadRequest } = useLoadRequest();
    const [isLoading, setIsLoading] = useState(false);
    
    const handleRegenerate = useCallback(async () => {
        setIsLoading(true);
        try {
            const { image } = await loadRequest(
                () => regenerateImage(currentPageData.detailedDescription),
                "Regenerating image..."
            );
            dispatch(updatePage({ 
                index: currentPage, 
                data: { 
                    image: image
                }
            }));
        } catch (error) {
            console.error('Error regenerating image:', error);
        } finally {
            setIsLoading(false);
        }
    }, [currentPage, currentPageData, dispatch, regenerateImage, loadRequest]);

    return {
        currentPageData,
        handleRegenerate,
        isLoading
    };
};

export default usePagePreview;
