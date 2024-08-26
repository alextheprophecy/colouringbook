const {queryFluxSchnell, queryFluxBetter} = require("./replicate.controller");
const {Axios} = require("axios");
const crypto = require('crypto')
const axios = require("axios");
const imgToPDF = require('image-to-pdf')
const {createWriteStream, appendFile} = require("fs");
const {queryPagesDescriptions} = require("./openai.controller");


const SAVEPATH = "../Builds/ColouringBooks/"
const CHILD_PROMPT = (descr)=>`Children's detailed coloring book page of "${descr}". Get creative in the drawing. Only black outlines, no text, colorless, black and white, no missing limbs, no extra limbs, coherent`
const ADULT_PROMPT = (descr)=>`Adult's detailed colouring book page of "${descr}". With no shading, no text, no writing, unshaded, colorless, thin lines, black and white`
const genColouringBook = (req, res) =>{
    const imageCount = req.query.imageCount
    const preferences = req.query.preferences

    console.log(imageCount)
    queryPagesDescriptions(imageCount, preferences).then(a=> {
        let pageDescriptions = JSON.parse(a)
        if(pageDescriptions.length>imageCount) pageDescriptions = pageDescriptions.splice(0,imageCount)

        const images = pageDescriptions.map(descr    =>
            queryFluxSchnell(CHILD_PROMPT(descr)).then(imgLink => {
                console.log("LINK: ", imgLink)
                return axios.get(imgLink, {responseType: 'arraybuffer'}).then(response => Buffer.from(response.data, 'base64'))
            })
        )
        Promise.all(images).then(b64_array => {
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
        })
    })



}

module.exports = {
    genColouringBook
}