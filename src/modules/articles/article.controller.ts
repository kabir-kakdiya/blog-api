import db from "../../db/db.ts";
import { sendSuccess } from "../../lib/response.helpers.ts";
import type { ArticleInput } from "../../schemas/user.schema.ts";
import type { ProtectedHandler } from "../../types/express.ts";

export const createArticle: ProtectedHandler<ArticleInput> = async (req, res) => {
  const { title, description, text } = req.body;
  const { userId: author } = res.locals;

  const article = await db.insertInto("article").values({
    title, description, text, author
  }).returning(['id', 'title', 'description', 'text', 'createdAt']).executeTakeFirstOrThrow()

  return sendSuccess(res, article, 'Article created', 201)
}