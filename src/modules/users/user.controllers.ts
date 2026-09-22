import db from "../../db/db.ts";
import { AppError } from "../../lib/Errors.ts";
import { sendError, sendSuccess } from "../../lib/response.helpers.ts";
import type { LoginInput, SignupInput } from "../../schemas/user.schema.ts";
import type { BodyHandler } from '../../types/express.ts';

export const signup: BodyHandler<SignupInput> = async (req, res) => {
  const { fullName, email, password } = req.body;

  const [user] = await db.insertInto("user").values({
    fullName, email, password
  }).returning(["id", "fullName", "email", "createdAt"]).execute()

  return sendSuccess(res, user, "Account created", 201)
}

export const login: BodyHandler<LoginInput> = async (req, res) => {
  const { email, password } = req.body;
  const [user] = await db.selectFrom("user").selectAll()
    .where("email", "=", email)
    .execute()
  // throw new Error("Custom error")
  if (!user || password !== user.password) throw new AppError("Invalid credentials", 404)

  return sendSuccess(res, user, "Logged in successfully", 200)
}