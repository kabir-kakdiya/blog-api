import { randomUUIDv7 } from "node:crypto";

import { HeadObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import db from "../../db/db.ts";
import { BUCKET as Bucket, S3 } from "../../lib/constants.ts";
import { AppError, NotFoundError } from "../../lib/Errors.ts";
import type { ArticleMediaInput, CommentMediaInput, MediaInput } from "../../schemas/media.schema.ts";

export async function generatePresignedUrl(mediaObject: MediaInput | ArticleMediaInput | CommentMediaInput, userId: string) {
    const { contentType, size } = mediaObject;
    const key = `${userId}/${randomUUIDv7()}`;

    const url = await getSignedUrl(
        S3,
        new PutObjectCommand({
            Bucket,
            Key: key,
            ContentType: contentType,
            ContentLength: size,
        }),
        { expiresIn: 300 },
    );

    const mediaId = await db.transaction().execute(async (trx) => {
        const { id } = await trx
            .insertInto("media")
            .values({
                key,
                mimeType: contentType,
                userId,
                fileSize: size,
            })
            .returning("id")
            .executeTakeFirstOrThrow();

        if ("articleId" in mediaObject) {
            const { articleId, position } = mediaObject;
            await trx
                .selectFrom("article")
                .select("id")
                .where("id", "=", articleId)
                .where("authorId", "=", userId)
                .executeTakeFirstOrThrow(() => new NotFoundError("Article not found"));

            await trx
                .insertInto("articleMedia")
                .values({
                    articleId,
                    mediaId: id,
                    position,
                })
                .executeTakeFirstOrThrow();
        } else if ("commentId" in mediaObject) {
            const { commentId, position } = mediaObject;
            await trx
                .selectFrom("comment")
                .select("id")
                .where("id", "=", commentId)
                .where("authorId", "=", userId)
                .executeTakeFirstOrThrow(() => new NotFoundError("Comment not found"));
            await trx
                .insertInto("commentMedia")
                .values({
                    commentId,
                    mediaId: id,
                    position,
                })
                .executeTakeFirstOrThrow();
        }

        return id;
    });

    return { url, mediaId };
}

export async function confirmFileUpload(mediaId: string, userId: string) {
    const { key } = await db
        .selectFrom("media")
        .where("id", "=", mediaId)
        .where("userId", "=", userId)
        .select("key")
        .executeTakeFirstOrThrow(() => new NotFoundError("Media not found"));

    await S3.send(
        new HeadObjectCommand({
            Bucket,
            Key: key,
        }),
    );
    await db
        .updateTable("media")
        .set({ status: "active" })
        .where("id", "=", mediaId)
        .executeTakeFirstOrThrow(() => new AppError("Failed to confirm media upload. Please try after some time.", 500, false));
}
