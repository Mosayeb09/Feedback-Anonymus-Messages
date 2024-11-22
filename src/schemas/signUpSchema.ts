import {z} from 'zod'
 

export const usernamevalidation = z

   .string()
   .min(2,  "Username must be at least 2 characters")
   .max(20, "Username must be at most 20 characters")
   .regex(/^[a-zA-Z0-9_]+$/, "Username must only contain letters, numbers, and underscores")
   .trim()


   export const signupSchema = z.object({
    username:usernamevalidation,
    email:z.string().email({message:"Invalid email address"}),
    password:z.string().min(6,"Password must be at least 6 characters")
   })












