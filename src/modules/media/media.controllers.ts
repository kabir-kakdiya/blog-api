import { sendSuccess } from "../../lib/response.helpers.ts";
import type { ArticleMediaInput, CommentMediaInput, MediaConfirmInput, MediaInput } from "../../schemas/media.schema.ts";
import type { ProtectedHandler } from "../../types/express.ts";
import { confirmFileUpload, generatePresignedUrl } from "./media.services.ts";

export const generateProfileImageUrl: ProtectedHandler<MediaInput> = async (req, res) => {
    const { userId } = res.locals;
    const data = await generatePresignedUrl(req.body, userId);
    return sendSuccess(res, data, "Presigned URL created for profile", 201);
};

export const generateArticleMediaUrl: ProtectedHandler<ArticleMediaInput> = async (req, res) => {
    const { userId } = res.locals;
    const data = await generatePresignedUrl(req.body, userId);
    return sendSuccess(res, data, "Presigned URL created for article", 201);
};

export const generateCommentMediaUrl: ProtectedHandler<CommentMediaInput> = async (req, res) => {
    const { userId } = res.locals;
    const data = await generatePresignedUrl(req.body, userId);
    return sendSuccess(res, data, "Presigned URL created for comment", 201);
};

export const validateMediaUpload: ProtectedHandler<unknown, unknown, MediaConfirmInput> = async (req, res) => {
    const { userId } = res.locals;
    const { mediaId } = req.params;

    await confirmFileUpload(mediaId, userId);
    return sendSuccess(res, null, "Media upload successful");
};
