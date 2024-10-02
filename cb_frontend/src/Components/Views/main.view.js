import '../../Styles/Views/main_view.css'

import ScribbleText from "../UI/ui_scribble_text.component";
import {useState} from "react";
import IntroScreen from "../UI/intro_screen.component";
import {AnimatePresence} from "framer-motion";
import ExamplesView from "./example_books.view";

const MainView = () => {

    return <div className={"main-container"}>
       <ExamplesView/>

    </div>
}

export default MainView

