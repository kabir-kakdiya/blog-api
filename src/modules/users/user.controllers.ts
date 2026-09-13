import type { Request, Response } from "express";
import db from "../../db/db.ts";
import * as v from 'valibot'

const signupSchema = v.object({
    fullName: v.pipe(v.string(), v.trim()),
    email: v.pipe(v.string(),v.trim(), v.email()),
    password: v.pipe(v.string(), v.trim())
})

export async function signup(req: Request, res: Response){
    const result = v.safeParse(signupSchema,req.body)
    if(!result.success){
        return res.json({ data: result})
    }
    const {fullName, email, password} = result.output;
    const user = await db.insertInto("user").values({
        fullName, email, password
    }).returningAll().execute()

    return res.send({success: true, message:'Registration done', data:user})
}