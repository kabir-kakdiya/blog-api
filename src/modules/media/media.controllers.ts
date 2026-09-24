import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { randomUUIDv7 } from "node:crypto";
import { BUCKET, S3 } from "../../lib/constants.ts";
import type { MediaInput } from "../../schemas/media.schema.ts";
import type { ProtectedHandler } from "../../types/express.ts";
import { sendSuccess } from "../../lib/response.helpers.ts";

export const generatePresignedUrl: ProtectedHandler<MediaInput> = async (req, res) => {
    const { contentType } = req.body;
    const key = `uploads/${randomUUIDv7()}`;

    const url = await getSignedUrl(S3, new PutObjectCommand({ Bucket: BUCKET, Key: key, ContentType: contentType }), { expiresIn: 300 })

    return sendSuccess(res, { url, key }, 'Presigned URL created', 201)
}