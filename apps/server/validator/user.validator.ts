import { z } from 'zod';

export const AuthInput = z.object({
    username: z.string().min(3, "Name must me aof atleast 3 characters"),
    password: z.string().min(8, "Password must be 8 of 8 characters")
})