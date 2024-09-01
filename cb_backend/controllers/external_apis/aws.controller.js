const axios = require("axios");
const {S3Client, GetObjectCommand, PutObjectCommand} = require("@aws-sdk/client-s3");
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner')

const client = new S3Client({ region: 'eu-north-1'});

const bucketName='colouringbookpages';

const IMAGE_URL_TTL = 10 //in seconds

/**
 *
 * @param user
 * @param book
 * @return {Promise<Awaited<String>[]>} returns list of presigned URLs for each page of the given book
 */
const getBookImages = (user, book) => {
    console.log('fetching: ', JSON.stringify(book), _getImagePath(user.email, book.id, 0))
    const params = (index) => new GetObjectCommand({
        Bucket: bucketName,
        Key: _getImagePath(user.email, book.id, index)
    })

    return Promise.all(
        Array.from({length: book.pages}, (_, i) => {
            return getSignedUrl(client, params(i), {expiresIn: IMAGE_URL_TTL})
        })
    )
}

const uploadImages = (user, book_id, images) => {
    return Promise.all(images.map((img, i) =>
        _uploadFileFromURLToS3(img, _getImagePath(user.email, book_id, i))
    ))
}

const _getImagePath = (user_email, book_id, imageIndex) => `${user_email.replace('@', '(at)')}/${book_id}/p${imageIndex}.png`

const _uploadFileFromURLToS3 = (url, key) => {
    return axios.get(url, { responseType: "arraybuffer", responseEncoding: "binary" }).then((response) => {
        const params = new PutObjectCommand({
            ContentType: response.headers["content-type"],
            ContentLength: response.data.length.toString(), // or response.header["content-length"] if available for the type of file downloaded
            Bucket: bucketName,
            Body: response.data,
            Key: key
        })

        return client.send(params)
    });
}


module.exports = {
    uploadImages,
    getBookImages,
}