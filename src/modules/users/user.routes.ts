import { Router, type Router as ExpressRouter } from "express";
import validate from "../../middlewares/validateInput.ts";
import { loginSchema, signupSchema } from "../../schemas/user.schema.ts";
import { login, signup } from "./user.controllers.ts";

const userRouter: ExpressRouter = Router()

userRouter.post('/signup', validate({ body: signupSchema }), signup)
userRouter.post('/signin', validate({ body: loginSchema }), login)

export default userRouter