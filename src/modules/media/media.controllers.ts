import { randomUUIDv7 } from "node:crypto";

import { HeadObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import db from "../../db/db.ts";
import { BUCKET as Bucket, S3 } from "../../lib/constants.ts";
import { AppError, NotFoundError } from "../../lib/Errors.ts";
import { sendSuccess } from "../../lib/response.helpers.ts";
import type { MediaInput, MediaParamInput } from "../../schemas/media.schema.ts";
import type { ProtectedHandler } from "../../types/express.ts";

export const generatePresignedUrl: ProtectedHandler<MediaInput> = async (req, res) => {
    const { contentType, size } = req.body;
    const { userId } = res.locals;

    const key = `${userId}/${randomUUIDv7()}`;

    const [url, { id: mediaId }] = await Promise.all([
        getSignedUrl(
            S3,
            new PutObjectCommand({
                Bucket,
                Key: key,
                ContentType: contentType,
                ContentLength: size,
            }),
            { expiresIn: 300 },
        ),
        db
            .insertInto("media")
            .values({
                key,
                mimeType: contentType,
                userId,
                fileSize: size,
            })
            .returning("id")
            .executeTakeFirstOrThrow(),
    ]);

    return sendSuccess(res, { url, mediaId }, "Presigned URL created", 201);
};

export const confirmFileUpload: ProtectedHandler<unknown, unknown, MediaParamInput> = async (
    req,
    res,
) => {
    const { userId } = res.locals;
    const { mediaId } = req.params;
    const media = await db
        .selectFrom("media")
        .where("id", "=", mediaId)
        .where("userId", "=", userId)
        .select(["key"])
        .executeTakeFirstOrThrow(() => new NotFoundError("Media not found"));

    await S3.send(
        new HeadObjectCommand({
            Bucket,
            Key: media.key,
        }),
    );
    await db
        .updateTable("media")
        .set({ status: "active" })
        .where("id", "=", mediaId)
        .executeTakeFirstOrThrow(
            () =>
                new AppError(
                    "Failed to confirm media upload. Please try after some time.",
                    500,
                    false,
                ),
        );
    return sendSuccess(res, null, "Media upload successful");
};
