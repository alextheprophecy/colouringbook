import '../../Styles/example_book.css'
import GenerateBook from "../Creation/generate_book.component";
import {useTranslation} from "react-i18next";
import FlipBook from "../flip_book.component";
import ScribbleText from "../UI/ui_scribble_text.component";

const ExampleBooks = () => {
    const {t} = useTranslation()

    const BOOK1 = {title: t('examplebooks.rabbits'), pages_directory: "assets/images/book-football-rabbits/", pages: ['out-0.jpg','pic4.jpg', 'pic2.jpg', 'pic3.jpg', 'pic6.jpg', 'pic7.jpg', 'pic5.jpg']}
    const BOOK2 = {title: t('examplebooks.teamwork'), pages_directory: "assets/images/book1/", pages: ['im0.jpg', 'im1.jpg', 'im2.jpg', 'im3.jpg', 'im4.jpg', 'im5.jpg']}
    const BOOK3 = {title: t('examplebooks.batman-mario'), pages_directory: "assets/images/book-mario-batman/", pages: ['img0.jpg', 'img1.jpg', 'img2.jpg', 'img5.jpg', 'img4.jpg', 'img3.jpg']}
    const BOOK4 = {title: t('examplebooks.scenarios'), pages_directory: "assets/images/one-page-examples/", pages: ['A mosquito dancing like Michael Jackson under the moonlight', 'mosquito.jpg', 'A bear cub eating his favourite cereal', 'bear.jpg', 'Mario doing a handstand', 'mariohandstand.jpg']}
    const BOOK5 = {title: t('examplebooks.specific'), pages_directory: "assets/images/multiple_prompts/", pages: ['img8.jpg', 'img12.jpg', 'img16.jpg', 'img20.jpg', 'img24.jpg']}
    const OnlineBook =  {title: 'Online', pages_directory: "https://as1.ftcdn.net/v2/jpg/02/95/26/46/", pages: ['500_F_295264675_clwKZxogAhxLS9sD163Tgkz1WMHsq1RJ.jpg']}

    return <div className={"flex-container"}>
        <div style={{width:'60%', textAlign:'center'}}>
            <ScribbleText text={"Generate my Coloring Book"} roughness={1.5} fillColor={"#027a9f"} strokeColor={"#00a4d7"} />
        </div>

        <span className={"flex-break"}/>
        <FlipBook {...BOOK1}/>
        <span className={"flex-break"}/>
        <FlipBook {...BOOK2}/>
        <span className={"flex-break"}/>
        <FlipBook {...BOOK3}/>
        <span className={"flex-break"}/>
        <FlipBook {...BOOK4}/>
        <span className={"flex-break"}/>
        <FlipBook {...BOOK5}/>
    </div>
}

export default ExampleBooks
