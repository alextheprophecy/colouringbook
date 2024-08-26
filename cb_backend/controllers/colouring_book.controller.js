const {queryFluxSchnell, queryFluxBetter} = require("./replicate.controller");
const {Axios} = require("axios");
const crypto = require('crypto')
const axios = require("axios");
const imgToPDF = require('image-to-pdf')
const {createWriteStream, appendFile} = require("fs");
const {queryPagesDescriptions} = require("./openai.controller");


const SAVEPATH = "../Builds/ColouringBooks/"
const CHILD_PROMPT = (descr)=>`${descr}. Children's detailed colouring book. Only black outlines, no text, colorless, no shadows, no shading, black and white, no missing limbs, no extra limbs, coherent`
const ADULT_PROMPT = (descr)=>`${descr}. Adult's detailed colouring book. No shadows, no text, unshaded, colorless, coherent, thin lines, black and white`
const genColouringBook = (req, res) => {
    const imageCount = req.query.imageCount
    const preferences = req.query.preferences
    const forAdult = req.query.forAdult
    const imageModel = req.query.greaterQuality==='true'?queryFluxBetter:queryFluxSchnell

    queryPagesDescriptions(imageCount, preferences, forAdult).then(a=> {
        let pageDescriptions = JSON.parse(a)
        if(pageDescriptions.length>imageCount) pageDescriptions = pageDescriptions.splice(0,imageCount)

        Promise.all(pageDescriptions.map(descr => imageModel(CHILD_PROMPT(descr)))).then(images =>
            res.status(200).json(images)
        )
    })
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
    genColouringBook,
    genPDFFromImages
}