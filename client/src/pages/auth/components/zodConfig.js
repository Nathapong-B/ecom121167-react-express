import { z } from 'zod';

export const registerSchema = z
    .object({
        email: z.string().email({ message: 'Invalid Email' }).nonempty({ message: 'Field is require' }),
        password: z.string().min(8, { message: 'Password is weak, and should be at least 8 characters' }).nonempty({ message: 'Field is require' }),
        confirmpassword: z.string()
    })
    .refine(data => data.password === data.confirmpassword, { message: 'Password is not match', path: ['confirmpassword'] });
