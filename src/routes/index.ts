import { Router, type Router as ExpressRouter } from "express";
import userRouter from "../modules/users/user.routes.ts";

const apiV1Router: ExpressRouter = Router()

apiV1Router.use('/user', userRouter)

export default apiV1Router