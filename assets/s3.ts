import S3, { PutObjectRequest } from "aws-sdk/clients/s3";
import fs from "fs";

const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_KEY;

const s3 = new S3({
  region,
  accessKeyId,
  secretAccessKey
});

export const uploadFile = (file: Express.Multer.File) => {
  const fileStream = fs.createReadStream(file.path);

  const uploadParams: PutObjectRequest = {
    Bucket: bucketName || "crud-avatar-images",
    Body: fileStream,
    Key: file.filename,
  }

  return s3.upload(uploadParams).promise();
}

export const getFileStream = (fileKey: string) => {
  const downloadParams: PutObjectRequest = {
    Bucket: bucketName || "/crud-avatar-images",
    Key: fileKey,
  }

  return s3.getObject(downloadParams).createReadStream()
}

export const deleteFile = (fileKey: string) => {
  const deleteParams: PutObjectRequest = {
    Bucket: bucketName || "crud-avatar-images",
    Key: fileKey,
  }

  return s3.deleteObject(deleteParams).promise();
}