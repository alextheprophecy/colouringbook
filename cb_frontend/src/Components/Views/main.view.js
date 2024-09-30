import '../../Styles/Views/main_view.css'

import ScribbleText from "../UI/ui_scribble_text.component";
import {useState} from "react";
import IntroScreen from "../UI/intro_screen.component";
import {AnimatePresence} from "framer-motion";

const MainView = () => {
    const [showIntro, setShowIntro] = useState(true);

    const handleIntroEnd = () => {
        setShowIntro(false);
    };


    return <div className={"main-container"}>
        <AnimatePresence>
            {showIntro && <IntroScreen onAnimationEnd={handleIntroEnd} />}
        </AnimatePresence>

        {!showIntro && <div className={"main-title"}>
            <ScribbleText text={"Colour my "} roughness={1.5} fillColor={"#027a9f"} strokeColor={"#00a4d7"} />
            <div />
            <ScribbleText text={"Dreams"} roughness={1.5} fillColor={"#027a9f"} strokeColor={"#00a4d7"} />
        </div>}

    </div>
}

export default MainView

