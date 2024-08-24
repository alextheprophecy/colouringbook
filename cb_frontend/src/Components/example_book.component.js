import HTMLFlipBook from 'react-pageflip';
import '../Styles/example_book.css'
import GenerateBook from "./generate_book.component";
import {useTranslation} from "react-i18next";
import LanguageChange from "./Navbar/language_change.component";

const ExampleBook = () => {
    const {t} = useTranslation('common')
    const BLANK_PAGE = 0 //placeholder for a blank page in pages of a book

    const BOOK1 = {title: t('examplebooks.rabbits'), pages_directory: "assets/images/book-football-rabbits/",
        pages: ['out-0.jpg','pic4.jpg', 'pic2.jpg', 'pic3.jpg', 'pic6.jpg', 'pic7.jpg', 'pic5.jpg']}

    const BOOK2 = {title: t('examplebooks.teamwork'), pages_directory: "assets/images/book1/",
        pages: ['im0.jpg', 'im1.jpg', 'im2.jpg', 'im3.jpg', 'im4.jpg', 'im5.jpg']}

    const BOOK3 = {title: t('examplebooks.batman-mario'), pages_directory: "assets/images/book-mario-batman/",
        pages: ['img0.jpg', 'img1.jpg', 'img2.jpg', 'img5.jpg', 'img4.jpg', 'img3.jpg']}

    const BOOK4 = {title: t('examplebooks.scenarios'), pages_directory: "assets/images/one-page-examples/",
        pages: ['A mosquito dancing like Michael Jackson under the moonlight', 'mosquito.jpg', 'A bear cub eating his favourite cereal', 'bear.jpg', 'Mario doing a handstand', 'mariohandstand.jpg']}

    const BOOK5 = {title: t('examplebooks.specific'), pages_directory: "assets/images/multiple_prompts/",
        pages: ['img8.jpg', 'img12.jpg', 'img16.jpg', 'img20.jpg', 'img24.jpg']}

    const generateFlipBook = ({title, pages_directory, pages}) => {
        const _getImagePageHTML = (imageCompletePath, pNumber) => <img src={imageCompletePath} className={`no-select rounded-${pNumber % 2 === 1 ? 'r' : 'l'}`}/>
        const _getTextPageHTML = (text, pNumber) => <div className={`text-page no-select rounded-${pNumber % 2 === 1 ? 'r' : 'l'}`}><br/>{text}</div>
        const _getBlankPageHTML = (pNumber) => <div className={`blank-page no-select rounded-${pNumber % 2 === 1 ? 'r' : 'l'}`}></div>

        if(pages.length%2===1) pages.push(BLANK_PAGE) //if odd number of pages, add extra blank page at end

        return <span className={"book-container"}>
            <div className={"book-title"}>"{title}"</div>
            <HTMLFlipBook className={"curved-page"} size={"stretch"} width={320} height={480}>
                {pages.map((p, i) =>
                    p===BLANK_PAGE ? _getBlankPageHTML(i) :
                        ['.jpg', '.png'].some(ext => p.endsWith(ext)) ? _getImagePageHTML(pages_directory + p, i) : _getTextPageHTML(p, i)
                )}
            </HTMLFlipBook>
        </span>
    }

    return <div className={"flex-container"}>
        <LanguageChange/>
        <GenerateBook/>
        <span className={"flex-break"}/>
        {generateFlipBook(BOOK1)}
        <span className={"flex-break"}/>
        {generateFlipBook(BOOK2)}
        <span className={"flex-break"}/>
        {generateFlipBook(BOOK3)}
        <span className={"flex-break"}/>
        {generateFlipBook(BOOK4)}
        <span className={"flex-break"}/>
        {generateFlipBook(BOOK5)}
    </div>
}

export default ExampleBook