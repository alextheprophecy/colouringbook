const {getFileUrl, getFileData, uploadFromBase64URI, uploadStream, uploadBuffer} = require("../external_apis/aws.controller");
const imgToPDF = require('image-to-pdf')
const { PassThrough } = require('stream');

const URL_TTL = {IMAGE: (Number)(24 * 3600), PDF: (Number)(12 * 3600)}

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
    key: `${_book_key(user_email, book_id)}/page_${imageIndex}.png`, 
    TTL: URL_TTL.IMAGE
})

const pdf_data = (user_email, book_id) => ({
    key: `${_book_key(user_email, book_id)}/book.pdf`, 
    TTL: URL_TTL.PDF
})

const log_data = (user_email, book_id) => ({
    key: `${_book_key(user_email, book_id)}/book_data.txt`, 
    TTL: URL_TTL.PDF
})

const getPDF = (user, book) => {
    if(book.pageCount <= 0) return null;
    return getFileUrl(pdf_data(user.email, book.id))
}

const getImage = (user, book, imageIndex) => {
    if(book.pageCount <= imageIndex) return null;
    return getFileUrl(image_data(user.email, book.id, imageIndex))
}

const saveBookPDF = async (imageBuffers, user, book) => {
    const pdfStream = imgToPDF(imageBuffers, imgToPDF.sizes.A4)
    const passThroughStream = new PassThrough()
    pdfStream.pipe(passThroughStream);
    return uploadStream(passThroughStream, pdf_data(user.email, book.id).key, 'application/pdf')
}

const savePageData = async (user, bookId, pageNumber, imageData) => {
    const currentKey = image_data(user.email, bookId, pageNumber).key;
    
    // Upload current version
    const [uploadResult, presignedUrl] = await Promise.all([
        uploadStream(imageData, currentKey, 'image/png'),
        getFileUrl({key: currentKey, TTL: URL_TTL.IMAGE})        
    ]);

    // Return the version ID from the upload result
    return {
        url: presignedUrl,
        versionId: uploadResult.VersionId
    };
}

module.exports = {
    getPDF,
    saveBookPDF,
    savePageData,
    image_data,
    getFileData,
    getImage,
    log_data
}
