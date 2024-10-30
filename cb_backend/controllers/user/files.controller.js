const {getFileUrl, getFileData, uploadFromBase64URI, uploadStream, uploadBuffer} = require("../external_apis/aws.controller");
const imgToPDF = require('image-to-pdf')
const { PassThrough } = require('stream');

const URL_TTL = {IMAGE: (Number)(3600), PDF: (Number)(12 * 3600)}

const _book_key = (user_email, book_id) => {
    // Strip all non-alphanumeric characters except for @ first
    const sanitizedEmail = user_email
        .toLowerCase()
        .replace(/[^a-z0-9@]/g, '')
        // Then replace @ with hyphen
        .replace('@', '-');
    return `v2_users/${sanitizedEmail}/${book_id}`;
}

const image_data = (user_email, book_id, imageIndex) => ({
    key: `${_book_key(user_email, book_id)}/p${imageIndex}.png`, 
    TTL: URL_TTL.IMAGE
})

const pdf_data = (user_email, book_id) => ({
    key: `${_book_key(user_email, book_id)}/book.pdf`, 
    TTL: URL_TTL.PDF
})

const getPDF = (user, book) =>
    getFileUrl(pdf_data(user.email, book.id))

const getImage = (user, book, imageIndex) =>
    getFileUrl(image_data(user.email, book.id, imageIndex))

const saveBookPDF = async (imageBuffers, user, book) => {
    const pdfStream = imgToPDF(imageBuffers, imgToPDF.sizes.A4)
    const passThroughStream = new PassThrough()
    pdfStream.pipe(passThroughStream);
    return uploadStream(passThroughStream, pdf_data(user.email, book.id).key, 'application/pdf')
}

const savePageData = async (user, bookId, pageNumber, imageBuffer) => {
    const baseKey = _book_key(user.email, bookId);
    const timestamp = Date.now();
    
    const versionKey = `${baseKey}/versions/p${pageNumber}/v_${timestamp}.png`;
    const currentKey = `${baseKey}/p${pageNumber}.png`;
    console.log('image:', imageBuffer);
    await Promise.all([
        uploadBuffer(imageBuffer, {key: versionKey}),
        uploadBuffer(imageBuffer, {key: currentKey})
    ]);

    return getFileUrl({key: currentKey, TTL: URL_TTL.IMAGE});
}

module.exports = {
    getPDF,
    saveBookPDF,
    savePageData,
    image_data,
    getFileData,
    getImage
}
