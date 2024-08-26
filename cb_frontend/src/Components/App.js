import { Suspense } from 'react';
import ExampleBook from "./example_book.component";
import LanguageChange from "./Navbar/language_change.component";
import '../Styles/main.css'
import BookCreation from "./book_creation";
function App() {
    return (
        <>
            <BookCreation/>
            <LanguageChange/>
        </>
    );
}
export default function TranslatedApp() {
    return (
        <Suspense fallback="...loading page...">
            <App />
        </Suspense>
    )
}