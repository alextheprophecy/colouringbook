import { useDispatch } from 'react-redux';
import { startLoading, stopLoading } from '../../redux/bookSlice';

const useLoadRequest = () => {
    const dispatch = useDispatch();

    const loadRequest = async (asyncFunction, loadingText = 'Loading...') => {
        dispatch(startLoading(loadingText)); // Pass the loading text
        try {
            const result = await asyncFunction();
            return result;
            //TODO: if result is false, show error message in a pop up

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
