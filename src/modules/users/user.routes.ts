import { Router, type Router as ExpressRouter } from "express";
import validate from "../../middlewares/validateInput.ts";
import { signupSchema } from "../../schemas/auth.schemas.ts";
import { signup } from "./user.controllers.ts";

const userRouter: ExpressRouter = Router()

userRouter.post('/signup', validate({ body: signupSchema }), signup)

export default userRouter