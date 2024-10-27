import React, { Suspense, useState, useEffect } from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import LoginView from "./Components/Views/login.view";
import GalleryView from "./Components/Views/gallery.view";
import PlaygroundView from "./Components/Views/playground.view";
import ScribbleText from "./Components/UI/ui_scribble_text.component";
import BurgerMenu from "./Components/Navbar/burger_menu.component";
import Navbar from "./Components/Navbar/navbar.component";
import Background from './Components/UI/background.component';
import './Styles/main.css';
import MainView from "./Components/Views/main.view";
import { AnimatePresence } from "framer-motion";
import IntroScreen from "./Components/UI/intro_screen.component";
import {setShouldShowIntro, shouldShowIntro} from "./Hooks/UserDataHandler";
import CreateBook from "./Components/Views/CreateBook";

function App() {
    const routes = (
        <Routes>            
            <Route exact path='/' element={<><Navbar /><MainView /></>} />
            <Route exact path='/create' element={<><CreateBook/></>} />
            <Route exact path='/login' element={<><Navbar /><LoginView /></>} />
            <Route exact path='/gallery' element={<><GalleryView /></>} />
            <Route exact path='/playground' element={<><Navbar /><PlaygroundView /></>} />
            <Route exact path='/test' element={<><PlaygroundView /></>} />
        </Routes>
    );

    return routes;
}

export default function TranslatedApp() {
    const [showIntro, setShowIntro] = useState(shouldShowIntro);
    useEffect(() => {
        if (showIntro) {
            const timer = setTimeout(() => {
                setShowIntro(false);
                setShouldShowIntro(false);
            }, 2500);
            return () => clearTimeout(timer);
        }
    }, [showIntro]);

    const website = (
        <>
            <BurgerMenu />
                <div className="page-container">
                    <main className="main-content">                        
                        <App />
                    </main>
                </div>
        </>
    );

    return (
        <Suspense fallback="...loading page...">
            <BrowserRouter>
                {website}
                <AnimatePresence>
                    {showIntro && <IntroScreen />}
                </AnimatePresence>
            </BrowserRouter>
        </Suspense>
    );
}