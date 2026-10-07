import Router, { type Router as ExpressRouter } from "express";

import authenticateUser from "../../middlewares/authenticate.ts";
import validate from "../../middlewares/validateInput.ts";
import { articleMediaSchema, commentMediaSchema, mediaConfirmSchema, mediaSchema } from "../../schemas/media.schema.ts";
import { generateArticleMediaUrl, generateCommentMediaUrl, generateProfileImageUrl, validateMediaUpload } from "./media.controllers.ts";

const mediaRouter: ExpressRouter = Router();
const presignedUrlRouter: ExpressRouter = Router();

mediaRouter.use(authenticateUser);
mediaRouter.get("/:mediaId/confirm", validate({ params: mediaConfirmSchema }), validateMediaUpload);
mediaRouter.use("/presigned-url", presignedUrlRouter);

presignedUrlRouter.post("/profile", validate({ body: mediaSchema }), generateProfileImageUrl);
presignedUrlRouter.post("/article", validate({ body: articleMediaSchema }), generateArticleMediaUrl);
presignedUrlRouter.post("/comment", validate({ body: commentMediaSchema }), generateCommentMediaUrl);

export default mediaRouter;
