import { z } from 'zod';


//=======user sign up schema==============

export const registerSchema = z.object({
    name: z.string().min(2).max(255),
    email: z.string().email().refine((email) => email.endsWith('@vitbhopal.ac.in'), {
        message: 'Please enter a valid VIT Bhopal email ending with @vitbhopal.ac.in',
    }),
    registrationNumber: z.string().min(1).max(255),
    password: z.string().min(6).max(255),
    avatar: z.string().optional(),
});
