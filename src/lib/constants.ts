import { S3Client } from "@aws-sdk/client-s3"

export const MIN_STRING_LENGTH = 2;
export const URL_LENGTH_MESSAGE = "URL must be atleast 2 characters";
export const S3 = new S3Client({ region: process.env.AWS_DEFAULT_REGION! })
export const BUCKET = process.env.S3_BUCKET!

export const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"] as const;