import { S3Client } from "@aws-sdk/client-s3";

import env from "../env.ts";

export const MIN_STRING_LENGTH = 2;
export const URL_LENGTH_MESSAGE = "URL must be atleast 2 characters";
export const S3 = new S3Client({ region: env.AWS_REGION });
export const BUCKET = env.S3_BUCKET;

export const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"] as const;
