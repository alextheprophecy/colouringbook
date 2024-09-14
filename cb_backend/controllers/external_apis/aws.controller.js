const axios = require("axios");
const {S3Client, GetObjectCommand, PutObjectCommand} = require("@aws-sdk/client-s3")
const { Upload } = require('@aws-sdk/lib-storage')
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner')
const client = new S3Client({ region: process.env.AWS_DEFAULT_REGION});

const BUCKET_NAME='colouringbookpages'



const getFileUrl = (file_data) =>
    getSignedUrl(client, new GetObjectCommand({Bucket: BUCKET_NAME, Key: file_data.key}), {expiresIn: file_data.TTL})


const uploadFromURL = (url, file_data) => {
    return axios.get(url, { responseType: "arraybuffer", responseEncoding: "binary" }).then((response) => {
        const params = new PutObjectCommand({
            ContentType: response.headers["content-type"],
            ContentLength: response.data.length.toString(), // or response.header["content-length"] if available for the type of file downloaded
            Bucket: BUCKET_NAME,
            Body: response.data,
            Key: file_data.key
        })
        return client.send(params)
    })
}

const uploadStream = (stream, key, contentType) => {
    const upload = new Upload({
        client,
        params: {
            Bucket: BUCKET_NAME,
            Key: key,
            Body: stream,
            ContentType: contentType,
        },
    })
    return upload.done()
}

const getFileData = async (key) => {
    const command = new GetObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key
    })
    const response = await client.send(command)
    const imageStream = response.Body
    return new Promise((resolve, reject) => {
        const chunks = []
        imageStream.on('data', (chunk) => chunks.push(chunk))  // Collect image data in chunks
        imageStream.on('end', () => resolve(Buffer.concat(chunks)))  // Return as a buffer
        imageStream.on('error', reject)
    })
}


module.exports = {
    getFileUrl,
    uploadFromURL,
    getFileData,
    uploadStream,
}