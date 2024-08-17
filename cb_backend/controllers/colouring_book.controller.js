const {queryFluxSchnell} = require("./replicate.controller");
const {Axios} = require("axios");
const crypto = require('crypto')
const axios = require("axios");
const imgToPDF = require('image-to-pdf')
const {createWriteStream, appendFile} = require("fs");
const {queryPagesDescriptions} = require("./openai.controller");

const genColouringBook = (req, res) =>{
     const constImages = ["https://replicate.delivery/yhqm/WTyuUWfPRjRsdCJhhDPjYV7pvOblnQn5RgcESmJFREVjh1pJA/out-0.png", "https://replicate.delivery/yhqm/WTyuUWfPRjRsdCJhhDPjYV7pvOblnQn5RgcESmJFREVjh1pJA/out-0.png"]

    const imageCount = req.query.imageCount
    const preferences = req.query.preferences

    console.log(imageCount)
    queryPagesDescriptions(imageCount, preferences).then(a=> {
        let pageDescriptions = JSON.parse(a)
        if(pageDescriptions.length>imageCount) pageDescriptions = pageDescriptions.splice(0,imageCount)

        const images = pageDescriptions.map(descr =>
            queryFluxSchnell(`Children's colouring book page of "${descr}", no text, no writing, colorless, black and white`).then(imgLink => {
                console.log("LINK: ", imgLink)
                return axios.get(imgLink, {responseType: 'arraybuffer'}).then(response => Buffer.from(response.data, 'base64'))
            })
        )
        Promise.all(images).then(b64_array => {
            const hash = crypto.createHash('sha1').update(Date.now().toString().concat(b64_array[0])).digest('hex').slice(0,10)
            const fileName = `coloring_book_${hash}.pdf`
            const stream = imgToPDF(b64_array, imgToPDF.sizes.A4).pipe(createWriteStream(`./lib/builds/${fileName}`))
            stream.on("finish", () => {
                appendFile('./lib/builds/books_descriptions.txt', `${fileName}: ${preferences}`, (err) => {
                    if(err){
                        console.log(err)
                        res.send(400)
                    }
                    res.status(200).send(`Succesfully generated in:     ${fileName}`)
                })
            })
        })
    })



}

module.exports = {
    genColouringBook
}