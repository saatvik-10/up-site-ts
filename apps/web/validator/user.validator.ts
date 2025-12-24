import { z } from 'zod';

export const AuthInput = z.object({
    email: z.email("Email is required!"),
    password: z.string().min(8, "Password must be at least 8 characters")
});

export type AuthInputType = z.infer<typeof AuthInput>;