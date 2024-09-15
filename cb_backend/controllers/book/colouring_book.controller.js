const {queryFluxSchnell, queryFluxBetter, randomSavedSeed} = require("../external_apis/replicate.controller");
const Book = require("../../models/book.model");
const {uploadBookImages, getImageData, saveBookPDF} = require("../user/files.controller");
const {pagesSimpleStory} = require("./book_description.controller");

const MAX_PAGE_COUNT = 6

const CHILD_PROMPT = (description)=>`${description}. Children's detailed colouring book. Only black outlines, no text, colorless, no shadows, no shading, black and white, no missing limbs, no extra limbs, coherent`
const ADULT_PROMPT = (description)=>`${description}. Adult's detailed colouring book. No shadows, no text, unshaded, colorless, coherent, thin lines, black and white`

const generateColouringBook = (bookData, user) => {
    const onlyDescriptions = bookData.onlyDescriptions

    const imageCount = Number(Math.min(bookData.imageCount, MAX_PAGE_COUNT))
    const preferences = bookData.preferences
    const forAdult = bookData.forAdult
    const imageModel = bookData.greaterQuality?queryFluxBetter:queryFluxSchnell
    const gen_seed = randomSavedSeed()

    console.log(imageCount, preferences)
    return pagesSimpleStory(preferences, imageCount, forAdult).then(pages_array => {
        let pageDescriptions = pages_array.map(p => p.page_description)// JSON.parse(a.choices[0].message.content).pagesArray//JSON.parse(a)
        let pageSummaries = pages_array.map(p => p.page_summary)// JSON.parse(a.choices[0].message.content).pagesArray//JSON.parse(a)
        console.log('results : ', pageSummaries)

        if (pageDescriptions.length > imageCount) pageDescriptions = pageDescriptions.splice(0, imageCount)
        if (onlyDescriptions) return pageDescriptions

        console.log('going to query flux')
        return Promise.all(pageDescriptions.map(descr => imageModel((forAdult?ADULT_PROMPT:CHILD_PROMPT)(descr), gen_seed)))
            .then(images => {
                return addNewBookToUser(user,
                    {description: preferences, pages: imageCount, seed: gen_seed, page_summaries: pageSummaries}
                ).then(newBook =>
                    uploadBookImages(user, newBook.id, images).then(_ => images)
                )
            })
    })
}

const addNewBookToUser = (user, {description, pages, seed, page_summaries}) => {
    const book = new Book({userId: user.id, description: description, pages: pages,
        gen_seed: seed, page_summaries: page_summaries})
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