import { z } from "zod";
export const signupSchema = z.object({
  name: z.string().min(2).max(50).optional(),
  email: z.string().email(),
  password: z.string().min(8),
});
export const signinSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});
