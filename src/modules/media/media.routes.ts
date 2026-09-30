import Router, { type Router as ExpressRouter } from "express";

import authenticateUser from "../../middlewares/authenticate.ts";
import validate from "../../middlewares/validateInput.ts";
import { mediaParamSchema, mediaSchema } from "../../schemas/media.schema.ts";
import { confirmFileUpload, generatePresignedUrl } from "./media.controllers.ts";

const mediaRouter: ExpressRouter = Router();

mediaRouter.use(authenticateUser);
mediaRouter.get("/:mediaId/confirm", validate({ params: mediaParamSchema }), confirmFileUpload);
mediaRouter.post("/presign", validate({ body: mediaSchema }), generatePresignedUrl);

export default mediaRouter;
