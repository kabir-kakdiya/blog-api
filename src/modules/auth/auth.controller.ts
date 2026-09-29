import argon2 from "argon2";

import db from "../../db/db.ts";
import { AppError } from "../../lib/Errors.ts";
import { sendSuccess } from "../../lib/response.helpers.ts";
import { generateToken } from "../../lib/token.helpers.ts";
import type { LoginInput, SignupInput } from "../../schemas/user.schema.ts";
import type { BodyHandler } from "../../types/express.ts";

export const signup: BodyHandler<SignupInput> = async (req, res) => {
    const { fullName, email, password, bio, ...socials } = req.body;
    try {
        const { user, userSocials } = await db.transaction().execute(async (trx) => {
            const hash = await argon2.hash(password);
            const user = await trx
                .insertInto("user")
                .values({
                    fullName,
                    email,
                    hash,
                    bio,
                })
                .returning(["id", "fullName", "email", "bio", "createdAt"])
                .executeTakeFirstOrThrow();
            let userSocials = null;
            if (Object.keys(socials).length) {
                userSocials = await db
                    .insertInto("social")
                    .values({ userId: user.id, ...socials })
                    .returning(["twitter", "facebook", "linkedin"])
                    .executeTakeFirstOrThrow();
            }
            return { user, userSocials };
        });
        const token = generateToken(user.id);
        return sendSuccess(res, { ...user, token, socials: userSocials }, "Account created", 201);
    } catch (error) {
        if (error instanceof Error && "code" in error && error.code === "23505") {
            throw new AppError("Email already exists. Please log in", 400);
        }
        throw error;
    }
};

export const login: BodyHandler<LoginInput> = async (req, res) => {
    const { email, password } = req.body;

    const user = await db
        .selectFrom("user")
        .select(["id", "fullName", "email", "bio", "hash"])
        .where("email", "=", email)
        .executeTakeFirst();
    if (!user || !(await argon2.verify(user.hash, password)))
        throw new AppError("Invalid credentials", 401);
    const token = generateToken(user.id);
    const { hash, ...safeUser } = user;
    return sendSuccess(res, { ...safeUser, token }, "Logged in successfully", 200);
};
