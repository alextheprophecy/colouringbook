import '../../Styles/Views/main_view.css'

import ScribbleText from "../UI/ui_scribble_text.component";
import {useState} from "react";
import IntroScreen from "../UI/intro_screen.component";
import {AnimatePresence} from "framer-motion";
import ExamplesView from "./example_books.view";

const MainView = () => {
    const [showIntro, setShowIntro] = useState(false);

    const handleIntroEnd = () => {
        setShowIntro(false);
    }

    return <div className={"main-container"}>
        <AnimatePresence>
            {showIntro && <IntroScreen onAnimationEnd={handleIntroEnd} />}
        </AnimatePresence>

        {!showIntro && <ExamplesView/>}

    </div>
}

export default MainView

