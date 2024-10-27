import { useDispatch } from 'react-redux';
import { startBook } from '../../redux/bookSlice';
import useLoadRequest from './useLoadRequest';
import api from '../../Hooks/ApiHandler'; // Assuming you have an API handler for making requests

const useCreateBook = () => {
    const dispatch = useDispatch();
    const { loadRequest } = useLoadRequest();

    const createBook = async (title) => {
        await loadRequest(async () => {
            
            const response = await api.post('user/createBook', {title});
            const { book } = response.data;
            console.log(book._id)
            // After successful creation, update the state
            dispatch(startBook({bookId: book._id, title}));
            return book; 
        }, `Creating Book ${title}`);
    };

    return { createBook };
};

export default useCreateBook;
