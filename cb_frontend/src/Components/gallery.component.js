import {useEffect, useState} from "react";
import api from "../Hooks/ApiHandler";
import ExampleBooks from "./example_books.component";
import FlipBook from "./flip_book.component";
import '../Styles/gallery.css'
import {getBookData, saveBookData} from "../Hooks/UserDataHandler";

const Gallery = () => {
    const [books, setBooks] = useState([])

    useEffect(() => {
        const books = getBookData()
        console.log('books', books)
        if(books)setBooks(books)
        else loadValues()
    }, []);

    const loadValues = () => {
        api.get('user/getBooks').then(r => {
            console.log('books: ', r.data)
            if(!r) return
            setBooks(r.data)
            saveBookData(r.data)
            window.location.reload()
        })

    }

    const downloadBook = (book) => {
        api.get('image/getBookPDF', {params: {book: book}}).then(r => {
            const url = r.data
            console.log(url)
            // Create a temporary <a> element and trigger the download
            const link = document.createElement('a');
            link.href = url;
            link.download = `ColouringBook.pdf`; // Set filename for the download
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        })
    }

    const showBooks = () => {
        const bookData = book => ({title: book.title, pages_directory: '', pages: book.pages, on_download:() => downloadBook(book)})
        return books.map(b => <FlipBook {...bookData(b)}/>)
    }

    return<div>

        <div className={"flex-container-vertical"}>
            <button onClick={loadValues} className={'gallery-refresh-button'}>Refresh new books</button>

            {showBooks()}
        </div>
    </div>
}

export default Gallery