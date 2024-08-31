/*
const {pLimit} = require("p-limit")
const limit = pLimit(10) //free cloudinary plan concurrent limit: 10
*/
/*

let cloudinary = require('cloudinary').v2

cloudinary.config({
    cloud_name: 'duywg0gtu',
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
});

const folder = 'ColouringBooks'

const _getImageName = (user_id, book_id, imageIndex) => `${user_id}_book${book_id}_page${imageIndex}`

const saveImages = (images, book_id, user_id) => {
    console.log(_getImageName(user_id, book_id, 0))
    const options = (i) => {return {asset_folder: folder, use_filename: true,
        use_filename_as_display_name: true, public_id: _getImageName(user_id, book_id, i), overwrite: false} }
    return Promise.all(
        images.map((url, i) =>
            cloudinary.uploader.upload(url, {asset_folder: folder}).then(a => // RETURN URLS: .then(d=> d.url)
                console.log(a)
            )
        )
    ).then(a => console.log('he', a)).catch(err => console.log(err))
}

const getUserImages = (user_id, book_id, imageCount) => {
    return Promise.all(Array.from({length: imageCount}, (_, i) =>
        cloudinary.api.resource(_getImageName(user_id, book_id, i)).then(d=>d.url)))
}

module.exports = {
    saveImages,
    getUserImages
}*/

const axios = require("axios");
const folder = 'ColouringBooks'
const _getImageName = (user_id, book_id, imageIndex) => `${user_id}_${book_id}_${imageIndex}`

const uploadFileToS3 = (url, bucket, key) => {
    return axios.get(url, { responseType: "arraybuffer", responseEncoding: "binary" }).then((response) => {
        const params = {
            ContentType: response.headers["content-type"],
            ContentLength: response.data.length.toString(), // or response.header["content-length"] if available for the type of file downloaded
            Bucket: bucket,
            Body: response.data,
            Key: key,
        };
        return s3.putObject(params).promise();
    });
}
const saveImages = (images, book_id, user_id) => {

}

const getUserImages = (user_id, book_id, imageCount) => {

}

module.exports = {
    saveImages,
    getUserImages
}