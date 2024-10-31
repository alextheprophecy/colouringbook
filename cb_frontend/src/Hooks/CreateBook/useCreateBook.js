import { useDispatch } from 'react-redux';
import { startBook } from '../../redux/bookSlice';
import { addNotification } from '../../redux/websiteSlice';
import useLoadRequest from './useLoadRequest';
import api from '../../Hooks/ApiHandler'; // Assuming you have an API handler for making requests
import { setAskFeedback } from '../../redux/websiteSlice';
const useCreateBook = () => {
    const dispatch = useDispatch();
    const { loadRequest } = useLoadRequest();

    const createBook = async (title) => {
        if (!title.trim()) {
            dispatch(addNotification({
                type: 'error',
                message: 'Please enter a book title',
                duration: 3000
            }));
            return false;
        }

        try {
            await loadRequest(async () => {
                const response = await api.post('user/createBook', { title });
                const { book } = response.data;
                
                dispatch(startBook({ bookId: book._id, title }));
                dispatch(addNotification({
                    type: 'success',
                    message: `Successfully created "${title}"`,
                    duration: 3000
                }));
                
                return book;
            }, `Creating Book ${title}`);
            
            return true;
        } catch (error) {
            dispatch(addNotification({
                type: 'error',
                message: error.message || 'Failed to create book. Please try again.',
                duration: 5000
            }));
            return false;
        }
    };

    return { createBook };
};

export default useCreateBook;
