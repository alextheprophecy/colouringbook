const axios = require("axios");
const {S3Client, GetObjectCommand, PutObjectCommand} = require("@aws-sdk/client-s3")
const { Upload } = require('@aws-sdk/lib-storage')
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner')
const client = new S3Client({ region: process.env.AWS_DEFAULT_REGION});

const BUCKET_NAME='colouringbookpages'


const getFileUrl = ({key, TTL=3600}) =>
    getSignedUrl(client, new GetObjectCommand({Bucket: BUCKET_NAME, Key: key}), {expiresIn: TTL})

const getFileData = async (key, versionId = null) => {
    const command = new GetObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
        ...(versionId && { VersionId: versionId })
    })
    const response = await client.send(command)
    const imageStream = response.Body
    return new Promise((resolve, reject) => {
        const chunks = []
        imageStream.on('data', (chunk) => chunks.push(chunk))
        imageStream.on('end', () => resolve(Buffer.concat(chunks)))
        imageStream.on('error', reject)
    })
}

const uploadFromBase64URI = (dataURI, {key}) => {
    // Remove the data URL prefix and get just the base64 data
    const base64Data = dataURI.replace(/^data:image\/\w+;base64,/, '');
    //get the image filetype: const mimeType = dataURI.match(/^data:([^;]+);base64,/)[1];

    // Convert base64 to buffer
    const buffer = Buffer.from(base64Data, 'base64');
    
    const params = new PutObjectCommand({
        ContentType: 'image/png',  // You can make this dynamic if needed
        ContentLength: buffer.length.toString(),
        Bucket: BUCKET_NAME,
        Body: buffer,
        Key: key
    });

    
    return client.send(params);
}


const uploadStream = (stream, key, contentType) => {
    const upload = new Upload({
        client,
        params: {
            Bucket: BUCKET_NAME,
            Key: key,
            Body: stream,
            ContentType: contentType,
            VersionId: 'null'
        },
    })
    return upload.done()
}

const uploadBuffer = (buffer, {key, contentType = 'image/png'}) => {
    const params = new PutObjectCommand({
        ContentType: contentType,
        Bucket: BUCKET_NAME,
        Body: buffer,
        Key: key
    });
    
    return client.send(params);
}

const getFileUrlWithVersion = async ({key, versionId, TTL=3600}) => {
    const command = new GetObjectCommand({
        Bucket: BUCKET_NAME, 
        Key: key,
        VersionId: versionId
    });
    return getSignedUrl(client, command, {expiresIn: TTL});
}

module.exports = {
    getFileUrl,
    getFileData,
    uploadFromBase64URI,
    uploadStream,
    uploadBuffer,
    getFileUrlWithVersion
}
