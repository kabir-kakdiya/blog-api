import * as v from 'valibot'
import { MIN_STRING_LENGTH, URL_LENGTH_MESSAGE } from '../lib/constants.js'
import { minLengthMessage } from '../lib/helpers.ts';

export const userSchema = v.object({
    fullName: v.pipe(v.string("Full name is required"), v.trim(), v.minLength(MIN_STRING_LENGTH, minLengthMessage("full name"))),
    email: v.pipe(v.string("Email is required"), v.email("Please provide a valid email")),
    password: v.pipe(v.string("Password is required"), v.minLength(8, minLengthMessage("password"))),
    bio: v.optional(v.pipe(v.string(), v.minLength(2, "Bio must be atleast of 2 characters")))
})

export const socialSchema = v.object({
    twitter: v.optional(v.pipe(v.string(), v.trim(), v.minLength(MIN_STRING_LENGTH, URL_LENGTH_MESSAGE))),
    linkedin: v.optional(v.pipe(v.string(), v.trim(), v.minLength(MIN_STRING_LENGTH, URL_LENGTH_MESSAGE))),
    facebook: v.optional(v.pipe(v.string(), v.trim(), v.minLength(MIN_STRING_LENGTH, URL_LENGTH_MESSAGE))),
})

export const signupSchema = v.object({
    ...userSchema.entries, ...socialSchema.entries
})
export type SignupInput = v.InferOutput<typeof signupSchema>

export const loginSchema = v.pick(signupSchema, ["email", "password"])
export type LoginInput = v.InferOutput<typeof loginSchema>


export const articleSchema = v.object({
    title: v.pipe(v.string(), v.trim(), v.minLength(MIN_STRING_LENGTH, minLengthMessage("title"))),
    description: v.pipe(v.string(), v.trim(), v.minLength(MIN_STRING_LENGTH, minLengthMessage("description"))),
    text: v.pipe(v.string(), v.trim(), v.minLength(MIN_STRING_LENGTH, minLengthMessage("text"))),
})

export type ArticleInput = v.InferOutput<typeof articleSchema>;