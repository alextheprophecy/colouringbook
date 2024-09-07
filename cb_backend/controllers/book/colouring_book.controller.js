const {queryFluxSchnell, queryFluxBetter} = require("../external_apis/replicate.controller");
const crypto = require('crypto')
const imgToPDF = require('image-to-pdf')
const {createWriteStream, appendFile} = require("fs");
const {queryPagesDescriptions, getPageDescriptions_2} = require("../external_apis/openai.controller");
const {uploadImages, uploadStreamToPDF} = require("../external_apis/aws.controller");
const Book = require("../../models/book.model");

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
        let pageDescriptions = a// JSON.parse(a.choices[0].message.content).pagesArray//JSON.parse(a)
        console.log('results : ', pageDescriptions)

        if (pageDescriptions.length > imageCount) pageDescriptions = pageDescriptions.splice(0, imageCount)

        pageDescriptions = pageDescriptions.map(p => p.pageDescription)

        if(onlyDescriptions) return pageDescriptions

        console.log('going to query flux')
        return Promise.all(pageDescriptions.map(descr => imageModel((forAdult?ADULT_PROMPT:CHILD_PROMPT)(descr))))
            .then(images =>
                addNewBookToUser(user, {description: preferences, pages: imageCount}).then(newBook =>
                    uploadImages(user, newBook.id, images).then(a =>
                        images
                    )
                )
            )
    })
}

const addNewBookToUser = (user, {description, pages}) => {
    const book = new Book({userId: user.id, description: description, pages: pages})
    return book.save()
}

const test = (req, res) => {
    res.status(200).json('RESULT')
}


const genBookPDF = (req, res) => {
    const imageCount = req.query.imageCount
    const preferences = req.query.preferences?req.query.preferences:''
    //each imlink: axios.get(imgLink, {responseType: 'arraybuffer'})
    const b64_array = imageLinks.map(img => Buffer.from(img, 'base64'))

    uploadStreamToPDF(imgToPDF(b64_array, imgToPDF.sizes.A4))
    /*stream.on("finish", () => {
        appendFile(`${SAVEPATH}books_descriptions.txt`, `\n${fileName}:     ${preferences}`, (err) => {
            if(err){
                console.log(err)
                res.send(400)
            }
            res.status(200).send(`Succesfully generated in: ${fileName}`)
        })
    })*/
}


module.exports = {
    generateColouringBook,
    genBookPDF,
    test
}