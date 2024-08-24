import { Suspense } from 'react';
import ExampleBook from "./example_book.component";
import LanguageChange from "./Navbar/language_change.component";
import '../Styles/main.css'
function App() {
    return (
        <>
            <LanguageChange/>
            <ExampleBook/>
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