import { z } from 'zod';

export const AuthInput = z.object({
    email: z.email("Email is required!"),
    password: z.string().min(8, "Password must be of atleast 8 characters")
})