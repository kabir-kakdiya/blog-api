import { Router, type Router as ExpressRouter } from "express";
import userRouter from "../modules/users/user.routes.ts";
import articleRouter from "../modules/articles/article.routes.ts";

const apiV1Router: ExpressRouter = Router()

apiV1Router.use('/user', userRouter)
apiV1Router.use('/article', articleRouter)



export default apiV1Router