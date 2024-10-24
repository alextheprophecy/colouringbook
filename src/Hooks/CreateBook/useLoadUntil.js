import { useDispatch } from 'react-redux';
import { setIsLoading } from '../../redux/bookSlice';

const useLoadUntil = () => {
    const dispatch = useDispatch();

    const loadUntil = async (asyncFunction) => {
        dispatch(setIsLoading(true));
        try {
            const result = await asyncFunction();
            return result;
        } catch (error) {
            console.error('Error during async operation:', error);
            throw error;
        } finally {
            dispatch(setIsLoading(false));
        }
    };

    return { loadUntil };
};

export default useLoadUntil;
