import { z } from 'zod';

export const signupSchema = z.object({
  name: z.string().min(2, 'Nome muito curto'),
  email: z.string().email('E-mail inválido'),
  phone: z.string().min(10, 'Telefone inválido'),
  password: z.string().min(5, 'Senha curta'),
  planId: z.string().min(1, 'Plano obrigatório'),
});

export type SignupSchema = typeof signupSchema;
