const AWS = require('aws-sdk');
const axios = require("axios");

const bucketName='colouringbookpages';
const s3 = new AWS.S3();

const _getImagePath = (user_email, book_id, imageIndex) => `${user_email}/${book_id}/p.${imageIndex}`

const getUserImages = () => {

}

const uploadImages = (user, book_id, images) => {
    return Promise.all(images.map((img, i) =>
        uploadFileToS3(img, bucketName, _getImagePath(user.email, book_id, i))
    ))
}

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


module.exports = {
    uploadImages,
    getUserImages
}