import HTMLFlipBook from 'react-pageflip';
const BLANK_PAGE = 0 //placeholder for a blank page in pages of a book
const FlipBook = ({title, pages_directory, pages, on_download}) => {

    const bookLength = pages.length
    console.log(pages, title)
    const _getImagePageHTML = (imageCompletePath, pNumber) => <img src={imageCompletePath} className={`no-select rounded-${pNumber % 2 === 1 ? 'r' : 'l'}`}/>
    const _getTextPageHTML = (text, pNumber) => <div className={`text-page no-select rounded-${pNumber % 2 === 1 ? 'r' : 'l'}`}><br/>{text}</div>
    const _getBlankPageHTML = (pNumber) => <div className={`blank-page no-select rounded-${pNumber % 2 === 1 ? 'r' : 'l'}`}></div>

    if(pages.length%2===1) pages.push(BLANK_PAGE) //if odd number of pages, add extra blank page at end

    return  <span className={"book-container"}>
            <div className={"book-title"}>{`${bookLength}pages- ${title}`}</div>
            {on_download?<button className={'book-download-button'} onClick={on_download}>Download Book PDF</button>:''}
            <HTMLFlipBook className={"curved-page"} size={"stretch"} width={300} height={450}>
                {pages.map((p, i) =>
                    p===BLANK_PAGE ? _getBlankPageHTML(i) :
                        ['.jpg', '.png'].some(ext => p.split('?')[0].endsWith(ext)) ? _getImagePageHTML(pages_directory + p, i) : _getTextPageHTML(p, i)
                )}
            </HTMLFlipBook>
        </span>
}

export default FlipBook
