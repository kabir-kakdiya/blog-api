import { Router, type Router as ExpressRouter } from "express";

import articleRouter from "../modules/articles/article.routes.ts";
import authRouter from "../modules/auth/auth.routes.ts";
import mediaRouter from "../modules/media/media.routes.ts";

const apiV1Router: ExpressRouter = Router();

apiV1Router.use("/auth", authRouter);
apiV1Router.use("/article", articleRouter);
apiV1Router.use("/media", mediaRouter);

export default apiV1Router;
