import { Suspense } from 'react';
import ExampleBook from "./example_book.component";
import LanguageChange from "./Navbar/language_change.component";
import '../Styles/main.css'
import BookCreation from "./Creation/book_creation";
function App() {
    return (
        <div className={'main-container'}>
            <BookCreation/>
            <LanguageChange/>
        </div>
    );
}
export default function TranslatedApp() {
    return (
        <Suspense fallback="...loading page...">
            <App />
        </Suspense>
    )
}