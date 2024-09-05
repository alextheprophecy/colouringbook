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
            if(!r) return
            setBooks(r.data)
            saveBookData(r.data)
        })

    }

    const showBooks = () => {
        const bookData = book => ({title: book.title, pages_directory: '', pages: book.pages})
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