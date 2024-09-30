import React, { Suspense } from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import ExampleBooks from "./Components/Views/example_books.view";
import BookCreation from "./Components/Creation/book_creation";
import LoginView from "./Components/Views/login.view";
import Gallery from "./Components/Views/gallery.view";
import Playground from "./Components/Creation/playground.component";
import ScribbleText from "./Components/UI/ui_scribble_text.component";
import BurgerMenu from "./Components/Navbar/burger_menu.component";
import LanguageChange from "./Components/Navbar/language_change.component";
import Profile from "./Components/Navbar/profile.component";
import Background from './Components/UI/background.component';
import './Styles/main.css';

function App() {
    return (
            <Routes>
                <Route exact path='/' element={<ExampleBooks />} />
                <Route exact path='/create' element={<BookCreation />} />
                <Route exact path='/login' element={<LoginView />} />
                <Route exact path='/gallery' element={<Gallery />} />
                <Route exact path='/playground' element={<Playground />} />
                <Route exact path='/test' element={<ScribbleText />} />
            </Routes>
    );
}

export default function TranslatedApp() {
    return (
        <Suspense fallback="...loading page...">
            <BrowserRouter>
                <BurgerMenu />
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
