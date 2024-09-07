const axios = require("axios");
const {S3Client, GetObjectCommand, PutObjectCommand} = require("@aws-sdk/client-s3");
const { Upload } = require('@aws-sdk/lib-storage')

const { getSignedUrl } = require('@aws-sdk/s3-request-presigner')
const {PassThrough} = require("stream");

const client = new S3Client({ region: process.env.AWS_DEFAULT_REGION});

const bucketName='colouringbookpages';

const IMAGE_URL_TTL = 10 //in seconds
const PDF_URL_TTL = 12* 3600 //in seconds

const _bookPath = (user_email, book_id) => `${user_email.replace('@', '(at)')}/${book_id}`
const _getImagePath = (user_email, book_id, imageIndex) => `${_bookPath(user_email, book_id)}/p${imageIndex}.png`
const _getPDFPath = (user_email, book_id) => `${_bookPath(user_email, book_id)}/book.pdf`

/**
 *
 * @param user
 * @param book
 * @return {Promise<Awaited<String>[]>} returns list of presigned URLs for each page of the given book
 */
const getBookImages = (user, book) => {
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

const getPDF = (user_email, book) => {
    const params = (index) => new GetObjectCommand({
        Bucket: bucketName,
        Key: _getPDFPath(user_email, book.id)
    })
    getSignedUrl(client, params(i), {expiresIn: IMAGE_URL_TTL}).then(url => res.send(200))

}

async function uploadStreamToPDF(readableStream, user, book) {
    const Key = _getPDFPath(user.email, book.id);
    const passThroughStream = new PassThrough();

    let res;

    try {
        const parallelUploads3 = new Upload({
            client,
            params: {
                Bucket: bucketName,
                Key,
                Body: passThroughStream,
                ACL:'public-read',
            },
            queueSize: 4,
            partSize: 1024 * 1024 * 5,
            leavePartsOnError: false,
        });

        readableStream.pipe(passThroughStream);
        res = await parallelUploads3.done();
    } catch (e) {
        console.log(e);
    }

    return res;
}

module.exports = {
    uploadStreamToPDF,
    uploadImages,
    getBookImages,
}