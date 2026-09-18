import db from "../../db/db.ts";
import { sendSuccess } from "../../lib/response.helpers.ts";
import type { SignupInput } from "../../schemas/auth.schemas.ts";
import type { BodyHandler } from '../../types/express.ts';

export const signup: BodyHandler<SignupInput> = async (req, res) => {
  const { fullName, email, password } = req.body;

  const [user] = await db.insertInto("user").values({
    fullName, email, password
  }).returning(["id", "fullName", "email", "createdAt"]).execute()

  return sendSuccess(res, user, "Account created", 201)
}