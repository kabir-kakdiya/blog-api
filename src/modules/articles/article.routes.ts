import { Router, type Router as ExpressRouter } from "express";

import authenticateUser from "../../middlewares/authenticate.ts";
import validate from "../../middlewares/validateInput.ts";
import { articleSchema } from "../../schemas/user.schema.ts";
import { createArticle } from "./article.controller.ts";

const articleRouter: ExpressRouter = Router();

articleRouter.post("/", authenticateUser, validate({ body: articleSchema }), createArticle);

export default articleRouter;
