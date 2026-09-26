import { S3Client } from "@aws-sdk/client-s3"
import { SQSClient } from "@aws-sdk/client-sqs";

export const MIN_STRING_LENGTH = 2;
export const MAX_PASSWORD_LENGTH = 50;
export const URL_LENGTH_MESSAGE = "URL must be atleast 2 characters";
export const S3 = new S3Client({ region: process.env.AWS_DEFAULT_REGION! })
export const SQS = new SQSClient({ region: process.env.AWS_DEFAULT_REGION! })

export const BUCKET = process.env.S3_BUCKET!

export const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"] as const;
export const MAX_SIZE = 1024 * 1024 * 2 // in KB - 2 MB