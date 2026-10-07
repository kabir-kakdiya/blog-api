import * as v from "valibot";

import { ALLOWED_TYPES } from "../lib/constants.ts";

export const mediaSchema = v.object({
    contentType: v.picklist(ALLOWED_TYPES, "Unsupported type"),
    size: v.pipe(v.number("size must be a number")),
});

export const articleMediaSchema = v.object({
    ...mediaSchema.entries,
    articleId: v.pipe(v.string("articleId must be a string"), v.nonEmpty("articleId is required and cannot be empty")),
    position: v.pipe(
        v.number("Position must be a number"),
        v.minValue(0, "Position must be greater than 0"),
        v.maxValue(1000, "Position cannot exceed 1000"),
    ),
});

export const commentMediaSchema = v.object({
    ...mediaSchema.entries,
    commentId: v.pipe(v.string("commentId must be a string"), v.nonEmpty("commentId is required and cannot be empty")),
    position: v.pipe(
        v.number("Position must be a number"),
        v.minValue(0, "Position must be greater than 0"),
        v.maxValue(1000, "Position cannot exceed 1000"),
    ),
});
export type MediaInput = v.InferOutput<typeof mediaSchema>;
export type ArticleMediaInput = v.InferOutput<typeof articleMediaSchema>;
export type CommentMediaInput = v.InferOutput<typeof commentMediaSchema>;

export const mediaConfirmSchema = v.object({
    mediaId: v.pipe(v.string(), v.nonEmpty("mediaId cannot be empty")),
});
export type MediaConfirmInput = v.InferOutput<typeof mediaConfirmSchema>;
