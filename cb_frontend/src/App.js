import { Suspense } from 'react';
import ExampleBooks from "./Components/example_books.component";
import LanguageChange from "./Components/Navbar/language_change.component";
import './Styles/main.css'
import BookCreation from "./Components/Creation/book_creation";
import LoginForm from "./Components/Navbar/login_form.component";
import Profile from "./Components/Navbar/profile.component";
import Gallery from "./Components/gallery.component";
function App() {
    return (
        <div className={'main-container'}>
            <Gallery/>
            <LoginForm/>
            <Profile/>
        </div>
    );
}
export default function TranslatedApp() {
    return (
        <Suspense fallback="...loading page...">
            <App />
            <LanguageChange/>
        </Suspense>
    )
}