import { useRef, useCallback, useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setCurrentPage, setIsEditing} from '../../redux/bookSlice';

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
    const { pages, currentPage, isEditing} = useSelector(state => state.book);
    const flipBookRef = useRef(null);
    const [isFlipping, setIsFlipping] = useState(false);

    const isOnCreationPage = useCallback(() => {
        return currentPage === pages.length
    }, [currentPage, pages.length]);
    
    const getBookInstance = () => flipBookRef.current?.pageFlip();

    const startAnimation = useCallback((targetPage = pages.length-1, quickFlip = false) => {
        const book = getBookInstance();
        if (currentPage >= targetPage || !book || isFlipping) return;
        const startDelay = quickFlip ? FLIP_TIMES.QUICK_DELAY : (currentPage === 0 ? FLIP_TIMES.ANIMATION_DELAY : FLIP_TIMES.QUICK_DELAY)
       
        setIsFlipping(true);
        book.getSettings().disableFlipByClick = true;

        let currentPageIndex = currentPage;
        const flipThroughPages = () => {
            const flipSpeed = quickFlip ? (currentPageIndex === 0 ? FLIP_TIMES.QUICK_COVER : FLIP_TIMES.QUICK_FLIP) : (currentPageIndex === 0 ? FLIP_TIMES.ANIMATION_COVER : FLIP_TIMES.ANIMATION_FLIP);
    
            book.getSettings().flippingTime = flipSpeed

            if (currentPageIndex < targetPage) {
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
    }, [isFlipping, currentPage, pages.length]);

    const handlePageNavigation = {
        next: useCallback(() => {
            const book = getBookInstance();
            if (!isFlipping && book) {
                book.getSettings().flippingTime = currentPage===0?FLIP_TIMES.ANIMATION_COVER:FLIP_TIMES.ANIMATION_FLIP
                book.getSettings().disableFlipByClick = isOnCreationPage();
                if(!isOnCreationPage()) book.flipNext('top');
            }

        }, [isOnCreationPage, isFlipping, currentPage]),

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

    useEffect(() => {
        const book = getBookInstance();
        if (book) book.getSettings().useMouseEvents = !isOnCreationPage();
    }, [isOnCreationPage]);

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
            startAnimation(pages.length, true);
        }, [startAnimation, pages.length])
    };
};

export default useModifyBook;
