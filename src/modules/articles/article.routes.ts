import { Router, type Router as ExpressRouter } from "express";
import validate from "../../middlewares/validateInput.ts";
import { articleSchema } from "../../schemas/user.schema.ts";
import { createArticle } from "./article.controller.ts";
import authenticateUser from "../../middlewares/authenticate.ts";

const articleRouter: ExpressRouter = Router()

articleRouter.post('/', authenticateUser, validate({ body: articleSchema }), createArticle)

export default articleRouter