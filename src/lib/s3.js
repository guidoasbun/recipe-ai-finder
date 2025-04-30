import AWS from "aws-sdk";
import { v4 as uuidv4 } from "uuid";

const s3 = new AWS.S3({
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

export async function uploadImageToS3(fileBuffer, fileType) {
    const fileName = `${uuidv4()}.${fileType.split("/")[1]}`;

    const params = {
        Bucket: "recipe-ai-images",
        Key: fileName,
        Body: fileBuffer,
        ContentType: fileType
    };

    const data = await s3.upload(params).promise();
    return data.Location; // returns the public image URL
}