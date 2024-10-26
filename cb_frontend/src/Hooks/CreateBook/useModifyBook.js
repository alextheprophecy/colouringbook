import { useRef, useCallback, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setCurrentPage, setIsEditing, setIsModifyingBook } from '../../redux/bookSlice';

export const FLIP_TIMES = Object.freeze({
    USER: 600,
    QUICK_DELAY: 10,
    QUICK_FLIP: 150,
    ANIMATION_DELAY: 550,
    ANIMATION_COVER: 1200,
    ANIMATION_FLIP: 320
});

const useModifyBook = () => {
    const dispatch = useDispatch();
    const { pages, currentPage, isEditing, isModifyingBook } = useSelector(state => state.book);
    const flipBookRef = useRef(null);
    const [isFlipping, setIsFlipping] = useState(false);

    const isOnCreationPage = useCallback(() => currentPage === pages.length, [currentPage, pages.length]);
    
    const getBookInstance = () => flipBookRef.current?.pageFlip();

    const startAnimation = useCallback((targetPage = pages.length - 1, quickFlip = false) => {
        const book = getBookInstance();
        if (currentPage >= targetPage || !book || isFlipping) return;

        const flipSpeed = quickFlip ? FLIP_TIMES.QUICK_FLIP : FLIP_TIMES.ANIMATION_FLIP;
        const startDelay = quickFlip ? FLIP_TIMES.QUICK_DELAY : (currentPage === 0 ? FLIP_TIMES.ANIMATION_DELAY : FLIP_TIMES.QUICK_DELAY)

        setIsFlipping(true);
        book.getSettings().disableFlipByClick = true;
        
        let currentPageIndex = currentPage;
        const flipThroughPages = () => {
            book.getSettings().flippingTime = currentPageIndex === 0 
                ? FLIP_TIMES.ANIMATION_COVER 
                : flipSpeed;

            if (currentPageIndex < targetPage && isModifyingBook) {
                book.flipNext('top');
                currentPageIndex++;
                
                const delay = currentPageIndex === 1 ? (FLIP_TIMES.ANIMATION_COVER/3) : flipSpeed;
                setTimeout(() => {
                    dispatch(setCurrentPage(currentPageIndex));
                    flipThroughPages();
                }, delay);
            } else {
                setTimeout(() => {
                    dispatch(setCurrentPage(targetPage));
                    setIsFlipping(false);
                    book.getSettings().flippingTime = FLIP_TIMES.USER;
                    book.getSettings().disableFlipByClick = false;
                }, quickFlip ? FLIP_TIMES.QUICK_DELAY : FLIP_TIMES.USER);
            }
        };

        setTimeout(flipThroughPages, startDelay);
    }, [dispatch, isFlipping, currentPage, pages.length, isModifyingBook]);

    const handlePageNavigation = {
        next: useCallback(() => {
            const book = getBookInstance();
            if (!isFlipping && book) {
                book.getSettings().disableFlipByClick = isOnCreationPage();
                if(!isOnCreationPage()) book.flipNext('top');
            }

        }, [isOnCreationPage, isFlipping]),

        previous: useCallback(() => {
            const book = getBookInstance();
            if (!isFlipping && book) {
                if(isOnCreationPage()) book.getSettings().disableFlipByClick = false;
                if (currentPage > 0) book.flipPrev('top');
            }
        }, [currentPage, isFlipping, isOnCreationPage]),
    };

    const onFlip = useCallback((e) => {
        if(!isFlipping) dispatch(setCurrentPage(e.data));        
    }, [dispatch, isFlipping]);

    useEffect(() => {
        const book = getBookInstance();
        if (book) book.getSettings().useMouseEvents = !isOnCreationPage();
    }, [isOnCreationPage]);

    return {
        flipBookRef,
        pages,
        currentPage,
        isEditing,
        isModifyingBook,
        isFlipping,
        isOnCreationPage,
        startAnimation,
        handlePageNavigation,
        onFlip,
        toggleModifyingBook: () => dispatch(setIsModifyingBook(!isModifyingBook)),
        setIsEditing: (value) => dispatch(setIsEditing(value)),
        getCurrentPageImage: () => pages[currentPage]?.image || `https://placehold.co/400x600?text=Page+${currentPage + 1}`,
        flipToCreationPage: useCallback(() => {
            startAnimation(pages.length, true);
        }, [startAnimation, pages.length])
    };
};

export default useModifyBook;
