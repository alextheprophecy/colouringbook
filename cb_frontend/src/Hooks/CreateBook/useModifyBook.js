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
    ANIMATION_COVER: 750,
    ANIMATION_FLIP: 420
});

const useModifyBook = () => {
    const dispatch = useDispatch();
    const { pages, currentPage, bookId, isBookFinished, seeds, title, currentContext, isEditing} = useSelector(state => state.book);

    const flipBookRef = useRef(null);
    const [isFlipping, setIsFlipping] = useState(false);
    const [isFinishing, setIsFinishing] = useState(false);
    const { loadRequest } = useLoadRequest();
    const [pdfUrl, setPdfUrl] = useState(null);
    const { t } = useTranslation();
    const [isSinglePage, setIsSinglePage] = useState(false);
    const [selectedCreationPage, setSelectedCreationPage] = useState(false);
    
    const isOnCreationPage = useCallback(() => {
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
        console.log('startAnimation', targetPage, currentPage);
        const book = getBookInstance();
        
        console.log('startAnimation', targetPage, currentPage);
        if (!book || isFlipping || currentPage === targetPage) return;
        
        // Calculate the actual number of flips needed
        let flipsNeeded;
        if (isSinglePage) {
            flipsNeeded = targetPage - currentPage;
        } else {
            const currentSpread = currentPage === 0 ? 0 : Math.ceil((currentPage+1) / 2);
            const targetSpread = targetPage === 0 ? 0 : Math.ceil((targetPage+1) / 2);
            flipsNeeded = targetSpread - currentSpread;
        }
        console.log('need', flipsNeeded);

        if (flipsNeeded === 0) return;
        
        
        const isFlippingForward = flipsNeeded > 0;
        const startDelay = quickFlip ? FLIP_TIMES.QUICK_DELAY : 
            (currentPage === 0 || targetPage === 0) ? FLIP_TIMES.ANIMATION_DELAY : FLIP_TIMES.QUICK_DELAY;
        
        
        setIsFlipping(true);        
        
        let flipsCompleted = 0;
        
        const flipThroughPages = () => {
            const currentPageIndex = isFlippingForward ? 
                currentPage + (flipsCompleted * (isSinglePage ? 1 : 2)) :
                currentPage - (flipsCompleted * (isSinglePage ? 1 : 2));

            const isOnCover = currentPageIndex === 0 || currentPageIndex === 1;
            const flipSpeed = quickFlip ? 
                (isOnCover ? FLIP_TIMES.QUICK_COVER : FLIP_TIMES.QUICK_FLIP) : 
                (isOnCover ? FLIP_TIMES.ANIMATION_COVER : FLIP_TIMES.ANIMATION_FLIP);

            book.getSettings().flippingTime = flipSpeed;

            if (flipsCompleted < Math.abs(flipsNeeded)) {
                if (isFlippingForward) book.flipNext('top');
                else if(currentPage > 0) book.flipPrev('top');                
                
                flipsCompleted++;
                
                setTimeout(() => {
                    flipThroughPages();
                }, flipSpeed);
            } else {
                setTimeout(() => {
                    finishUp();
                }, quickFlip ? FLIP_TIMES.QUICK_DELAY : FLIP_TIMES.USER);
            }
        };

        const finishUp = () => {
            setIsFlipping(false);
            book.getSettings().flippingTime = FLIP_TIMES.USER;
            book.getSettings().disableFlipByClick = false;
        }
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
        window.scrollTo(0, 0);
    };

    // Disable mouse events when on creation page
    useEffect(() => {
        const book = getBookInstance();
        if (book) book.getSettings().useMouseEvents = isSinglePage ? !isOnCreationPage() : !isOnSelectedCreationPage();        
    }, [isOnCreationPage, isOnSelectedCreationPage, selectedCreationPage]);


    // Disable mobile scroll support when editing (to allow scroll of edit page aswell as book)
    useEffect(() => {
        const book = getBookInstance();
        if (book) book.getSettings().mobileScrollSupport = !isEditing;
    }, [isEditing]);

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

            // After PDF is generated, animate through the book
            startAnimation(pages.length - 1, true);

        } catch (error) {
            console.error('Error finishing book:', error);      
        } finally {
            setIsFinishing(false);
        }
    };   

    const handleCreatePageMouseEnter = () => {
        if (isSinglePage || isFlipping) return           
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
