import { z } from 'zod';

export const AuthInput = z.object({
    username: z.string().min(3, "Name must me of atleast 3 characters"),
    password: z.string().min(8, "Password must be of atleast 8 characters")
})