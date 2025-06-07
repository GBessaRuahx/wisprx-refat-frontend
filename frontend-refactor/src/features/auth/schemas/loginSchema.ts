import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(5, 'Senha muito curta'),
});

export type LoginSchema = typeof loginSchema;
