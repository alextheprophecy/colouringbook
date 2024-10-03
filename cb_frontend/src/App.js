import React, { Suspense, useState, useEffect } from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import CreationView from "./Components/Views/creation.view";
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

function App() {
    const routes = (
        <Routes>
            <Route exact path='/' element={<MainView />} />
            <Route exact path='/create' element={<CreationView />} />
            <Route exact path='/login' element={<LoginView />} />
            <Route exact path='/gallery' element={<GalleryView />} />
            <Route exact path='/playground' element={<PlaygroundView />} />
            <Route exact path='/test' element={<ScribbleText />} />
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
            <Navbar />
            <Background>
                <div className="page-container">
                    <main className="main-content">
                        <App />
                    </main>
                </div>
            </Background>
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