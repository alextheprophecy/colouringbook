import { Suspense } from 'react';
import ExampleBooks from "./Components/example_books.component";
import LanguageChange from "./Components/Navbar/language_change.component";
import './Styles/main.css'
import BookCreation from "./Components/Creation/book_creation";
import LoginForm from "./Components/Navbar/login_form.component";
import Profile from "./Components/Navbar/profile.component";
import Gallery from "./Components/gallery.component";
import {Routes, Route, BrowserRouter} from 'react-router-dom';
import BurgerMenu from "./Components/Navbar/burger_menu.component";

function App() {
    return (
        <div className={'main-container'}>
            <Routes> {/* The Switch decides which component to show based on the current URL.*/}
                <Route exact path='/' element={<ExampleBooks/>}></Route>
                <Route exact path='/create' element={<BookCreation/>}></Route>
                <Route exact path='/login' element={<LoginForm/>}></Route>
                <Route exact path='/gallery' element={<Gallery/>}></Route>
            </Routes>
        </div>
    );
}
export default function TranslatedApp() {
    return (
        <Suspense fallback="...loading page...">
            <BrowserRouter>
                <App />
                <BurgerMenu/>
            </BrowserRouter>
            <LanguageChange/>
            <Profile/>
        </Suspense>
    )
}