import { useDispatch } from 'react-redux';
import { startLoading, stopLoading } from '../../redux/websiteSlice';
import { useTranslation } from 'react-i18next';

const useLoadRequest = () => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    
    const loadRequest = async (asyncFunction, loadingText = t('modifybook.loading'), dontRefreshWarning = true) => {
        dispatch(startLoading({loadingText, dontRefreshWarning}));
        try {
            return await asyncFunction();
        } catch (error) {
            console.error('Error during async operation:', error);
            throw error;
        } finally {
            dispatch(stopLoading());
        }
    };

    return { loadRequest };
};

export default useLoadRequest;
