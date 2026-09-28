import Router, { type Router as ExpressRouter } from "express";

import validate from "../../middlewares/validateInput.ts";
import { loginSchema, signupSchema } from "../../schemas/user.schema.ts";
import { login, signup } from "./auth.controller.ts";

const authRouter: ExpressRouter = Router();

authRouter.post("/signup", validate({ body: signupSchema }), signup);
authRouter.post("/signin", validate({ body: loginSchema }), login);

export default authRouter;
