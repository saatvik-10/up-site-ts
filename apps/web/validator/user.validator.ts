import { z } from 'zod';

export const AuthInput = z.object({
    username: z.string().min(3, "Name must be at least 3 characters"),
    password: z.string().min(8, "Password must be at least 8 characters")
});

export type AuthInputType = z.infer<typeof AuthInput>;