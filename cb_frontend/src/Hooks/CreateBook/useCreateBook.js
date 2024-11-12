import { useDispatch } from 'react-redux';
import { startBook } from '../../redux/bookSlice';
import { addNotification } from '../../redux/websiteSlice';
import useLoadRequest from './useLoadRequest';
import api from '../../Hooks/ApiHandler'; // Assuming you have an API handler for making requests
import { setAskFeedback } from '../../redux/websiteSlice';
import { useTranslation } from 'react-i18next';

const useCreateBook = () => {
    const dispatch = useDispatch();
    const { loadRequest } = useLoadRequest();
    const { t } = useTranslation();

    const createBook = async (title) => {
        if (!title.trim()) {
            dispatch(addNotification({
                type: 'error',
                message: t('creation.hooks.please-enter-a-book-title'),
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
                    message: `${t('creation.hooks.successfully-created-title')} "${title}"`,
                    duration: 3000
                }));
                
                return book;
            }, `${t('creation.hooks.creating-book')} ${title}`);
            
            return true;
        } catch (error) {
            dispatch(addNotification({
                type: 'error',
                message: error.message || t('creation.hooks.failed-to-create-book-please-try-again'),
                duration: 5000
            }));
            return false;
        }
    };

    return { createBook };
};

export default useCreateBook;
