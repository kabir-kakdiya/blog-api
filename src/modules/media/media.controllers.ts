import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { randomUUIDv7 } from "node:crypto";
import { BUCKET, S3 } from "../../lib/constants.ts";
import { sendSuccess } from "../../lib/response.helpers.ts";
import type { MediaInput } from "../../schemas/media.schema.ts";
import type { ProtectedHandler } from "../../types/express.ts";
import db from "../../db/db.ts";

export const generatePresignedUrl: ProtectedHandler<MediaInput> = async (req, res) => {
    const { contentType, filename, size } = req.body;
    const { userId } = res.locals
    const key = `${userId}/${randomUUIDv7()}-${filename}`;
    const command = new PutObjectCommand({
        Bucket: BUCKET,
        Key: key,
        ContentType: contentType,
        ContentLength: size
    })


    const url = await getSignedUrl(S3, command, { expiresIn: 300 })

    await db.insertInto("media").values({
        key, fileSize: size, mimeType: contentType, userId
    }).execute();

    return sendSuccess(res, { url, key }, 'Presigned URL created', 201)
}