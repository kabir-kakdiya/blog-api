import Router, { type Router as ExpressRouter } from "express"
import { generatePresignedUrl } from "./media.controllers.ts";
import validate from "../../middlewares/validateInput.ts";
import { mediaSchema } from "../../schemas/media.schema.ts";
import authenticateUser from "../../middlewares/authenticate.ts";

const mediaRouter: ExpressRouter = Router();

mediaRouter.use(authenticateUser)
mediaRouter.post("/presign", validate({ body: mediaSchema }), generatePresignedUrl)

export default mediaRouter;