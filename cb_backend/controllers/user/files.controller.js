const {getFileUrl, uploadFromURL, getFileData, uploadStream} = require("../external_apis/aws.controller");
const imgToPDF = require('image-to-pdf')
const { PassThrough } = require('stream');

const URL_TTL = {IMAGE: (Number)(3600), PDF: (Number)(12 * 3600)}

const _book_key = (user_email, book_id) => `${user_email.replace('@', '(at)')}/${book_id}`

const image_data = (user_email, book_id, imageIndex) => ({key: `${_book_key(user_email, book_id)}/p${imageIndex}.png`, TTL: URL_TTL.IMAGE})

const pdf_data = (user_email, book_id) => ({key: `${_book_key(user_email, book_id)}/book.pdf`, TTL: URL_TTL.PDF})


const getBookImages = (user, book) =>
    Promise.all(
        Array.from({length: book.pages}, (_, i) =>
            getFileUrl(image_data(user.email, book.id, i)))
    )

const uploadBookImages = (user, book_id, images) =>
    Promise.all(images.map((img, i) =>
        uploadFromURL(img, image_data(user.email, book_id, i))
    ))

const getImageData = (user, book, imageIndex) =>
    getFileData(image_data(user.email, book.id, imageIndex).key)

const getPDF = (user, book) =>
    getFileUrl(pdf_data(user.email, book.id))

const saveBookPDF = async (imageBuffers, user, book) => {
    const pdfStream = imgToPDF(imageBuffers, imgToPDF.sizes.A4)  // Convert images to PDF stream
    const passThroughStream = new PassThrough()

    pdfStream.pipe(passThroughStream);

    return uploadStream(passThroughStream, pdf_data(user.email, book.id).key, 'application/pdf')
}

module.exports = {
    getPDF,
    getBookImages,
    uploadBookImages,
    saveBookPDF,
    getImageData
}