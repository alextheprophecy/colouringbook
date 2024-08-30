import { Suspense } from 'react';
import ExampleBook from "./Components/example_book.component";
import LanguageChange from "./Components/Navbar/language_change.component";
import './Styles/main.css'
import BookCreation from "./Components/Creation/book_creation";
import LoginForm from "./Components/Navbar/login_form.component";
function App() {
    return (
        <div className={'main-container'}>
            <LoginForm/>

            <BookCreation/>

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