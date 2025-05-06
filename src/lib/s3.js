import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";

const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

export async function uploadImageToS3(fileBuffer, fileType) {
    const fileName = `${uuidv4()}.${fileType.split("/")[1]}`;

    const command = new PutObjectCommand({
        Bucket: "recipe-ai-images",
        Key: fileName,
        Body: fileBuffer,
        ContentType: fileType,
    });

    const data = await s3.send(command);
    return `https://${"recipe-ai-images"}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
}