import { useDispatch } from 'react-redux';
import { startLoading, stopLoading } from '../../redux/bookSlice';
import { useTranslation } from 'react-i18next';
const useLoadRequest = () => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const loadRequest = async (asyncFunction, loadingText = t('modifybook.loading')) => {
        dispatch(startLoading(loadingText)); // Pass the loading text
        try {
            return await asyncFunction();
        } catch (error) {
            console.error('Error during async operation:', error);
            throw error;
        } finally {
            dispatch(stopLoading()); // Use stopLoading to reset loading state
        }
    };

    return { loadRequest };
};

export default useLoadRequest;
