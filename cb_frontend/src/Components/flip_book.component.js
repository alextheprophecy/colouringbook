import HTMLFlipBook from 'react-pageflip';
import {useCallback, useRef, useState} from "react";
const BLANK_PAGE = 0 //placeholder for a blank page in pages of a book
const FlipBook = ({title, pages_directory, pages, on_download}) => {
    const [currentPage, setCurrentPage] = useState(0); // Track the current page
    const flipBookRef = useRef(null);

    const bookLength = pages.length
    console.log(pages, title)
    const _getImagePageHTML = (imageCompletePath, pNumber) => <img src={imageCompletePath} className={`no-select rounded-${pNumber % 2 === 1 ? 'r' : 'l'}`}/>
    const _getTextPageHTML = (text, pNumber) => <div className={`text-page no-select rounded-${pNumber % 2 === 1 ? 'r' : 'l'}`}><br/>{text}</div>
    const _getBlankPageHTML = (pNumber) => <div className={`blank-page no-select rounded-${pNumber % 2 === 1 ? 'r' : 'l'}`}></div>

    if(pages.length%2===1) pages.push(BLANK_PAGE) //if odd number of pages, add extra blank page at end


    // Function to flip to the next page
    const handleNextPage = () => {
        if (flipBookRef.current && currentPage < pages.length - 2) {
            flipBookRef.current.pageFlip().flipNext()
            setCurrentPage(currentPage + 2)
        }
    }

    const handlePreviousPage = () => {
        if (flipBookRef.current && currentPage > 0) {
            flipBookRef.current.pageFlip().flipPrev()
            setCurrentPage(currentPage - 2)
        }
    }

    const onFlip = useCallback((e) => {
        setCurrentPage(e.data)
    }, [])


    return  <span className={"book-container"}>
            <div className={"book-title"}>{`${bookLength}pages- ${title}`}</div>
            {on_download ? (
                <button className="flipbook-button download-button" onClick={on_download}>
                    <img src="/assets/icons/download.svg" alt="Download" className="download-icon" />
                    PDF
                </button>
            ) : ''}
         <div className="flipbook-wrapper">

            <HTMLFlipBook ref={flipBookRef} onFlip={onFlip} size={"stretch"}
                          width={300} height={450}>
                {pages.map((p, i) =>
                    p===BLANK_PAGE ? _getBlankPageHTML(i) :
                        ['.jpg', '.png'].some(ext => p.split('?')[0].endsWith(ext)) ? _getImagePageHTML(pages_directory + p, i) : _getTextPageHTML(p, i)
                )}
            </HTMLFlipBook>


             {currentPage > 0 && (
                 <button className="flipbook-button page-button prev-page" onClick={handlePreviousPage}>
                     <img src="/assets/icons/next_page.svg" alt="Previous" className="arrow-icon horizontal-flip" />
                 </button>
             )}

             {currentPage < pages.length-2 && (
                 <button className="flipbook-button page-button next-page" onClick={handleNextPage}>
                     <img src="/assets/icons/next_page.svg" alt="Next" className="arrow-icon" />
                 </button>
             )}
        </div>
    </span>
}

export default FlipBook
