import React, { Suspense } from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import ExampleBooks from "./Components/example_books.component";
import BookCreation from "./Components/Creation/book_creation";
import LoginForm from "./Components/Navbar/login_form.component";
import Gallery from "./Components/gallery.component";
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
                <Route exact path='/login' element={<LoginForm />} />
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
