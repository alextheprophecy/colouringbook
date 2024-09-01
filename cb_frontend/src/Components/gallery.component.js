import {useEffect, useState} from "react";
import api from "../Hooks/ApiHandler";
import ExampleBooks from "./example_books.component";
import FlipBook from "./flip_book.component";
import '../Styles/example_book.css'
import {getBookData, saveBookData} from "../Hooks/UserDataHandler";

const Gallery = () => {
    const [books, setBooks] = useState([])

    useEffect(() => {
        const books = getBookData()
        console.log('books', books)
        if(books) setBooks(books)
    }, []);

    const loadValues = () => {
        api.get('user/getBooks').then(r => {
            if(!r) return
            setBooks(r.data)
            saveBookData(r.data)
            console.log(r.data)
        })

    }

    const showBooks = () => {
        const bookData = book => ({title: book.title, pages_directory: '', pages: book.pages})
        return books.map(b => <FlipBook {...bookData(b)}/>)
    }

    return <div className={"flex-container"}>
        <br/>
        <br/>
        {showBooks()}
        <button onClick={loadValues}>Click</button>
    </div>
}

export default Gallery