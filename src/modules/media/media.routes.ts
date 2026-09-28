import Router, { type Router as ExpressRouter } from "express";

import validate from "../../middlewares/validateInput.ts";
import { mediaSchema } from "../../schemas/media.schema.ts";
import { generatePresignedUrl } from "./media.controllers.ts";

const mediaRouter: ExpressRouter = Router();

mediaRouter.post("/presign", validate({ body: mediaSchema }), generatePresignedUrl);
export default mediaRouter;
