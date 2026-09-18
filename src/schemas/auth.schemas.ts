import * as v from 'valibot'

export const signupSchema = v.object({
    fullName: v.pipe(v.string("Full name is required"), v.trim(), v.minLength(2, "Name must be atleast 2 characters")),
    email: v.pipe(v.string("Email is required"), v.email("Please provide a valid email")),
    password: v.pipe(v.string("Password is required"), v.minLength(8, "Password must have atleast 8 characters"))
})

export type SignupInput = v.InferOutput<typeof signupSchema>