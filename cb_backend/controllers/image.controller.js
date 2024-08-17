const axios = require('axios');
const cv = require("@techstark/opencv-js");
// const cv = require("@techstark/opencv-js")
const { createCanvas, ImageData } = require('canvas');
const Jimp = require('jimp')
const {rgba} = require("jimp");

let imagesList = []
const appendImage = (mat, convertToColour=true) => {
    const a = mat.clone()
    if(convertToColour) cv.cvtColor(a, a, cv.COLOR_GRAY2RGBA)
    imagesList.push(a)
}

const showPictures = (listMats) => {
    const canvas = createCanvas(listMats.length*listMats[0].cols, listMats[0].rows);
    const ctx = canvas.getContext('2d');

    let offset = 0
    listMats.map((m, i) => {
        const imageData = new ImageData(new Uint8ClampedArray(m.data), m.cols, m.rows);
        ctx.putImageData(imageData, offset, 0);
        offset += m.cols
    })
    listMats.forEach(m=> {
        try {m.delete()
        }catch (e) {}
    })
    return canvas.toBuffer('image/png');
}

const transformImage = (src, detailed) => {
    const dst = new cv.Mat()

    cv.cvtColor(src, dst, cv.COLOR_RGBA2GRAY)
    appendImage(src, false)

    const diag = Math.sqrt(Math.pow(dst.size().width, 2)+Math.pow(dst.size().height, 2))

    let blurS = Math.round(1.5*(diag) / 512)
    if(detailed)blurS = blurS/3
    cv.blur(dst, dst, {width: blurS, height: blurS})

    cv.Canny(dst, dst, 95, 100, 3, true)

    const size = 2//Math.round(dst.size().width / 1024)
    const kernel = cv.getStructuringElement(cv.MORPH_RECT, new cv.Size(size, size))
    let anchor = new cv.Point(-1, -1);
    cv.dilate(dst, dst, kernel, anchor, 1, cv.BORDER_CONSTANT, cv.morphologyDefaultBorderValue())
    cv.bitwise_not(dst, dst)


    try {
        //cv.cvtColor(dst, dst, cv.COLOR_GRAY2RGBA)

        cv.cvtColor(dst, dst, cv.COLOR_GRAY2RGBA);

        // Iterate through each pixel and set alpha channel to 0 if the pixel is white.
        for (let row = 0; row < dst.rows; row++) {
            for (let col = 0; col < dst.cols; col++) {
                let pixel = dst.ucharPtr(row, col);
                let pixelB = src.ucharPtr(row, col);

                if (pixel[0] === 255 && pixel[1] === 255 && pixel[2] === 255) {
                    // Set the alpha channel to 0 (transparent).
                    pixel[0] = pixelB[0]
                    pixel[1] = pixelB[1]
                    pixel[2] = pixelB[2]
                    pixel[3] = 20
                }
            }
        }
        appendImage(dst, false)


    }catch (e){
        console.log("OOps", e)
    }


}

const modifyImg = (req, res, next) => {
    const link = req.query.imageUrl
    const detailed = req.query.detailed !== "false"
    console.log(detailed)
    console.log(link)
    imagesList = []
    Jimp.read(link).then(jimpSrc => {

        transformImage(cv.matFromImageData(jimpSrc.bitmap), detailed)

        const buffer = showPictures(imagesList)
        res.send(`data:image/png;base64,${Buffer.from(buffer.buffer).toString("base64")}`)
        //fs.writeFileSync('./myImage.png', buffer);
    })
}


module.exports = {modifyImg};