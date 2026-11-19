import { z } from 'zod';

export const signUpSchema = z.object({
  username: z.string(),
  email: z.email(),
  password: z.string().min(6),
  referralCode: z.string(),
  termsAccepted: z.boolean().parse(true)
})

export type SignUpDto = z.infer<typeof signUpSchema>

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
})

export type loginDto = z.infer<typeof loginSchema>
