const AWS = require('aws-sdk');
require('dotenv').config();

const s3 = new AWS.S3({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  signatureVersion: 'v4',
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET;

const generateUploadURL = async () => {
  const params = {
    Bucket: BUCKET_NAME,
    Key: `${Date.now()}`, // unique filename
    Expires: 60, // valid for 1 minute
    ContentType: 'application/pdf', // allow PDF for now
  };

  const uploadURL = await s3.getSignedUrlPromise('putObject', params);
  return uploadURL;
};

module.exports = { generateUploadURL };
