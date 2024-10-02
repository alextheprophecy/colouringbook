import React, { Suspense } from 'react';
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

function App() {
    return (
            <Routes>
                <Route exact path='/' element={<MainView />} />
                <Route exact path='/create' element={<CreationView />} />
                <Route exact path='/login' element={<LoginView />} />
                <Route exact path='/gallery' element={<GalleryView />} />
                <Route exact path='/playground' element={<PlaygroundView />} />
                <Route exact path='/test' element={<ScribbleText />} />
            </Routes>
    );
}

export default function TranslatedApp() {
    return (
        <Suspense fallback="...loading page...">
            <BrowserRouter>
                <BurgerMenu />

                <Navbar />
                <Background>
                <div className="page-container">
                    <main className="main-content">
                        <App />

                    </main>

                    {/*<footer> TODO: uncomment
                        <LanguageChange />
                    </footer>*/}
                </div>
                </Background>
            </BrowserRouter>
        </Suspense>
    );
}
