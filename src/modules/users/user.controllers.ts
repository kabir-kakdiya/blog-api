import argon2 from 'argon2';
import db from "../../db/db.ts";
import { AppError } from "../../lib/Errors.ts";
import { sendSuccess } from "../../lib/response.helpers.ts";
import { generateToken } from "../../lib/token.helpers.ts";
import type { LoginInput, SignupInput } from "../../schemas/user.schema.ts";
import type { BodyHandler } from '../../types/express.ts';

export const signup: BodyHandler<SignupInput> = async (req, res) => {
  const { fullName, email, password, bio, ...socials } = req.body;
  const hash = await argon2.hash(password)

  const user = await db.insertInto("user").values({
    fullName, email, hash, bio
  }).returning(["id", "fullName", "email", "createdAt", "bio"]).executeTakeFirstOrThrow()

  let userSocial = {};
  if (Object.keys(socials).length) {
    userSocial = await db.insertInto("social").values({ userId: user.id, ...socials }).returning(["twitter", "facebook", "linkedin"]).executeTakeFirstOrThrow()
  }

  const token = generateToken(user.id)
  return sendSuccess(res, { ...user, token, ...userSocial }, "Account created", 201)
}

export const login: BodyHandler<LoginInput> = async (req, res) => {
  const { email, password } = req.body;

  const user = await db.selectFrom("user").select(["id", "fullName", "email", "bio", "hash"])
    .where("email", "=", email)
    .executeTakeFirst()
  if (!user || !await argon2.verify(user.hash, password)) throw new AppError("Invalid credentials", 401)
  const token = generateToken(user.id)
  const { hash, ...safeUser } = user;
  return sendSuccess(res, { ...safeUser, token }, "Logged in successfully", 200)
}
