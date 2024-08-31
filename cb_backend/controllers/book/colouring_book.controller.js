const {queryFluxSchnell, queryFluxBetter} = require("../external_apis/replicate.controller");
const crypto = require('crypto')
const imgToPDF = require('image-to-pdf')
const {createWriteStream, appendFile} = require("fs");
const {queryPagesDescriptions} = require("../external_apis/openai.controller");
const {uploadImages} = require("../external_apis/aws.controller");
const Book = require("../../models/book.model");

const CHILD_PROMPT = (descr)=>`${descr}. Children's detailed colouring book. Only black outlines, no text, colorless, no shadows, no shading, black and white, no missing limbs, no extra limbs, coherent`
const ADULT_PROMPT = (descr)=>`${descr}. Adult's detailed colouring book. No shadows, no text, unshaded, colorless, coherent, thin lines, black and white`
const generateColouringBook = (bookData, user, res) => {
    const imageCount = bookData.imageCount
    const preferences = bookData.preferences
    const forAdult = bookData.forAdult
    const imageModel = bookData.greaterQuality?queryFluxBetter:queryFluxSchnell

    console.log('generating', bookData, user.name)

    queryPagesDescriptions(imageCount, preferences, forAdult).then(a=> {
        let pageDescriptions = JSON.parse(a)
        if (pageDescriptions.length > imageCount) pageDescriptions = pageDescriptions.splice(0, imageCount)

        console.log('going to query flux')
        Promise.all(pageDescriptions.map(descr =>
            imageModel((forAdult?ADULT_PROMPT:CHILD_PROMPT)(descr)))).then(images => {
            addNewBookToUser(user, {description: preferences, pages: imageCount}).then(newBook =>
                uploadImages(user, newBook.id, images).then(a => {
                    res.status(200).json({credits_updated: user.credits, images: images})
                })
            )
        })
    })
}

const addNewBookToUser = (user, {description, pages}) => {
    const book = new Book({userId: user.id, description: description, pages: pages})
    return book.save()
}


const genPDFFromImages = (req, res) => {
    const imageCount = req.query.imageCount
    const preferences = req.query.preferences?req.query.preferences:''
    //each imlink: axios.get(imgLink, {responseType: 'arraybuffer'})
    const b64_array = imageLinks.map(img => Buffer.from(img, 'base64'))

    const hash = crypto.createHash('sha1').update(Date.now().toString().concat(b64_array[0])).digest('hex').slice(0,10)
    const fileName = `colouring_book_${hash}.pdf`
    const stream = imgToPDF(b64_array, imgToPDF.sizes.A4).pipe(createWriteStream(SAVEPATH.concat(fileName)))
    stream.on("finish", () => {
        appendFile(`${SAVEPATH}books_descriptions.txt`, `\n${fileName}:     ${preferences}`, (err) => {
            if(err){
                console.log(err)
                res.send(400)
            }
            res.status(200).send(`Succesfully generated in: ${fileName}`)
        })
    })
}


module.exports = {
    generateColouringBook,
    genPDFFromImages,
}