import type { Request, Response } from "express";
import db from "../db/db.ts";
export async function signup(req: Request, res: Response) {
    const { fullName, email, password } = req.body;

    const user = await db.insertInto("user").values({
        fullName, email, password
    }).returningAll().execute()

}