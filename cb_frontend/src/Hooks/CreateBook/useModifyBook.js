import { useRef, useCallback, useState, useEffect} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setCurrentPage, setIsEditing, finishBook} from '../../redux/bookSlice';
import { addNotification, setAskFeedback } from '../../redux/websiteSlice';
import api from '../../Hooks/ApiHandler';
import useLoadRequest from './useLoadRequest';
import { useTranslation } from 'react-i18next';
export const FLIP_TIMES = Object.freeze({
    USER: 600,
    QUICK_DELAY: 10,
    QUICK_FLIP: 250,
    QUICK_COVER: 450,
    ANIMATION_DELAY: 550,
    ANIMATION_COVER: 1000,
    ANIMATION_FLIP: 420
});

const useModifyBook = () => {
    const dispatch = useDispatch();
    const { pages, currentPage, bookId, isBookFinished, seeds, title, currentContext} = useSelector(state => state.book);

    const flipBookRef = useRef(null);
    const [isFlipping, setIsFlipping] = useState(false);
    const [isFinishing, setIsFinishing] = useState(false);
    const { loadRequest } = useLoadRequest();
    const [pdfUrl, setPdfUrl] = useState(null);
    const { t } = useTranslation();
    const [isSinglePage, setIsSinglePage] = useState(false);
    const [selectedCreationPage, setSelectedCreationPage] = useState(false);
    
    const isOnCreationPage = useCallback(() => {
        console.log('isOnCreationPage', currentPage, pages.length);
        return currentPage >= pages.length;
    }, [currentPage, pages.length, isSinglePage]);
    
    const isOnSelectedCreationPage = useCallback(() => {
        const extraPage = !isSinglePage ? 1 : 0;
        return (pages.length % 2 === 1) ? 
            (selectedCreationPage && currentPage >= pages.length - (isSinglePage ? -1 : 0) + extraPage) : 
            currentPage >= pages.length - (isSinglePage ? -1 : 0) + extraPage;
    }, [currentPage, pages.length, selectedCreationPage, isSinglePage]);

    const getBookInstance = () => flipBookRef.current?.pageFlip();

    const startAnimation = useCallback((targetPage = pages.length, quickFlip = false) => {
        const extraPage = !isSinglePage ? 1 : 0;
        const adjustedTargetPage = targetPage + extraPage;
        console.log('startAnimation', adjustedTargetPage);
        const book = getBookInstance();
        if (currentPage >= adjustedTargetPage || !book || isFlipping) return;
        const startDelay = quickFlip ? FLIP_TIMES.QUICK_DELAY : (currentPage === 0 ? FLIP_TIMES.ANIMATION_DELAY : FLIP_TIMES.QUICK_DELAY)        
        setIsFlipping(true);
        book.getSettings().disableFlipByClick = true;

        let currentPageIndex = currentPage;
        const flipThroughPages = () => {
            const flipSpeed = quickFlip ? (currentPageIndex === 0 ? FLIP_TIMES.QUICK_COVER : FLIP_TIMES.QUICK_FLIP) : (currentPageIndex === 0 ? FLIP_TIMES.ANIMATION_COVER : FLIP_TIMES.ANIMATION_FLIP);
    
            book.getSettings().flippingTime = flipSpeed
            console.log('we are at', currentPageIndex, adjustedTargetPage);
            if (currentPageIndex < adjustedTargetPage) {
                book.flipNext('top');
                currentPageIndex++;
                
                setTimeout(() => {
                    flipThroughPages();
                }, flipSpeed);
            } else {
                setTimeout(() => {
                    setIsFlipping(false);
                    book.getSettings().flippingTime = FLIP_TIMES.USER;
                    book.getSettings().disableFlipByClick = false;
                }, quickFlip ? FLIP_TIMES.QUICK_DELAY : FLIP_TIMES.USER);
            }
        };

        setTimeout(flipThroughPages, startDelay);
    }, [isFlipping, currentPage, pages.length, isSinglePage]);

    const handlePageNavigation = {
        next: useCallback(() => {
            const book = getBookInstance();
            if (!isFlipping && book) {
                const extraPage = !isSinglePage ? 1 : 0;
                book.getSettings().flippingTime = currentPage === 0 ? FLIP_TIMES.ANIMATION_COVER : FLIP_TIMES.ANIMATION_FLIP;
                book.getSettings().disableFlipByClick = isOnCreationPage();
                if (!isOnCreationPage() && currentPage < pages.length + extraPage) book.flipNext('top');
            }
        }, [isOnCreationPage, isFlipping, currentPage, pages.length, isSinglePage]),

        previous: useCallback(() => {
            const book = getBookInstance();
            if (!isFlipping && book) {
                book.getSettings().flippingTime = currentPage===1?FLIP_TIMES.ANIMATION_COVER:FLIP_TIMES.ANIMATION_FLIP
                if(isOnCreationPage()) book.getSettings().disableFlipByClick = false;
                if (currentPage > 0) book.flipPrev('top');
            }
        }, [currentPage, isFlipping, isOnCreationPage]),
    };

    const onFlip = useCallback((e) => {
       dispatch(setCurrentPage(e.data));        
    }, [dispatch]);

    const updateOrientation = () => {
        const book = getBookInstance();
        if (book) setIsSinglePage(book.getOrientation() === 'portrait');
    };

    useEffect(() => {
        const book = getBookInstance();
        if (book) book.getSettings().useMouseEvents = isSinglePage ? !isOnCreationPage() : !isOnSelectedCreationPage();        
    }, [isOnCreationPage, isOnSelectedCreationPage, selectedCreationPage]);

    const handleFinishBook = async () => {
        if (isFinishing) return;
        
        if (isBookFinished) {
            if (!pdfUrl && !pages[0]?.pdfUrl) {
                dispatch(addNotification({
                    type: 'error',
                    message: t('error.pdf-url-not-found'),
                    duration: 3000
                }));
                return;
            }
            window.open(pdfUrl || pages[0].pdfUrl, '_blank');
            return;
        }

        setIsFinishing(true);
        try {
            const response = await loadRequest(
                async () => await api.post('image/finishBook', {
                    bookId,
                    bookData: {title, seeds, pages: {count: pages.length, content: pages.map(p => ({...p, image: null}))}, currentContext} 
                }),
                t('modifybook.generating-your-book')
            );
            
            const data = response.data;
            if (!data?.bookPDF) {
                throw new Error(t('error.no-pdf-url-received-from-server'));
            }
            
            setPdfUrl(data.bookPDF);
            window.open(data.bookPDF, '_blank');
            dispatch(finishBook());            
            dispatch(setAskFeedback(true));
            dispatch(addNotification({
                type: 'success',
                message: t('success.your-book-has-been-successfully-generated'),
                duration: 5000
            }));

        } catch (error) {
            console.error('Error finishing book:', error);      
        } finally {
            setIsFinishing(false);
        }
    };   

    const handleCreatePageMouseEnter = () => {
        if (isSinglePage) return           
        const book = getBookInstance();
        if (book) setSelectedCreationPage(true);          
    }

    const handleCreatePageMouseLeave = () => {
        if (isSinglePage) return;
        const book = getBookInstance();
        if (book) setSelectedCreationPage(false);
    }
    
    return {
        flipBookRef,
        pages,
        currentPage,
        isFlipping,
        isOnCreationPage,
        startAnimation,
        handlePageNavigation,
        onFlip,
        setIsEditing: (value) => dispatch(setIsEditing(value)),
        getCurrentPageImage: () => pages[currentPage]?.image || `https://placehold.co/400x600?text=Page+${currentPage + 1}`,
        flipToCreationPage: useCallback(() => {
            const extraPage = !isSinglePage ? 1 : 0;
            startAnimation(pages.length + extraPage, true);
        }, [startAnimation, pages.length, isSinglePage]),
        handleFinishBook,
        isFinishing,
        isBookFinished,
        pdfUrl,
        isSinglePage,
        handleCreatePageMouseEnter,
        handleCreatePageMouseLeave,
        updateOrientation
    };
};

export default useModifyBook;
