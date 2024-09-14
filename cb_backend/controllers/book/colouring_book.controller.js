const {queryFluxSchnell, queryFluxBetter} = require("../external_apis/replicate.controller");
const crypto = require('crypto')
const {createWriteStream, appendFile} = require("fs");
const {queryPagesDescriptions, getPageDescriptions_2} = require("../external_apis/openai.controller");
const Book = require("../../models/book.model");
const {uploadBookImages, getImageData, saveBookPDF} = require("../user/files.controller");

const MAX_PAGE_COUNT = 6

const CHILD_PROMPT = (descr)=>`${descr}. Children's detailed colouring book. Only black outlines, no text, colorless, no shadows, no shading, black and white, no missing limbs, no extra limbs, coherent`
const ADULT_PROMPT = (descr)=>`${descr}. Adult's detailed colouring book. No shadows, no text, unshaded, colorless, coherent, thin lines, black and white`

const generateColouringBook = (bookData, user, res) => {
    const onlyDescriptions = bookData.onlyDescriptions

    const imageCount = Number(Math.min(bookData.imageCount, MAX_PAGE_COUNT))
    const preferences = bookData.preferences
    const forAdult = bookData.forAdult
    const imageModel = bookData.greaterQuality?queryFluxBetter:queryFluxSchnell

    console.log(imageCount, preferences)
    return getPageDescriptions_2(imageCount, preferences, forAdult).then(a=> {
        let pageDescriptions = a.map(p => p.pageDescription)// JSON.parse(a.choices[0].message.content).pagesArray//JSON.parse(a)
        console.log('results : ', pageDescriptions)

        if (pageDescriptions.length > imageCount) pageDescriptions = pageDescriptions.splice(0, imageCount)
        if(onlyDescriptions) return pageDescriptions

        console.log('going to query flux')
        return Promise.all(pageDescriptions.map(descr => imageModel((forAdult?ADULT_PROMPT:CHILD_PROMPT)(descr))))
            .then(images_obj => {
                const images = images_obj.map(i=>i.image)
                return addNewBookToUser(user, {description: preferences, pages: imageCount, seed: images_obj[0].seed}).then(newBook =>
                        uploadBookImages(user, newBook.id, images).then(_ =>
                            images
                        )
                    )
                }
            )
    })
}

const addNewBookToUser = (user, {description, pages, seed}) => {
    const book = new Book({userId: user.id, description: description, pages: pages, gen_seed: seed})
    return book.save()
}

const test = (req, res) => {
    res.status(200).json('RESULT')
}


const genBookPDF = (user, book) =>
    Promise.all(Array.from({length: book.pages}, (_, i) => getImageData(user, book, i))).then(imageBuffers =>
        saveBookPDF(imageBuffers, user, book)
    )



module.exports = {
    generateColouringBook,
    genBookPDF,
    test
}