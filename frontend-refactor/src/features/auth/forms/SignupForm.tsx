import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signupSchema } from '@features/auth/schemas/signupSchema';
import { useSignUp } from '@features/auth/hooks/useSignUp';

export function SignupForm() {
  const { handleSignUp, loading } = useSignUp();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(signupSchema) });

  return (
    <form onSubmit={handleSubmit(handleSignUp)} className="space-y-4">
      <input className="w-full border p-2" placeholder="Nome" {...register('name')} />
      {errors.name && (
        <p className="text-red-500 text-sm">{errors.name.message as string}</p>
      )}
      <input className="w-full border p-2" placeholder="Email" {...register('email')} />
      {errors.email && (
        <p className="text-red-500 text-sm">{errors.email.message as string}</p>
      )}
      <input className="w-full border p-2" placeholder="Telefone" {...register('phone')} />
      {errors.phone && (
        <p className="text-red-500 text-sm">{errors.phone.message as string}</p>
      )}
      <input type="password" className="w-full border p-2" placeholder="Senha" {...register('password')} />
      {errors.password && (
        <p className="text-red-500 text-sm">{errors.password.message as string}</p>
      )}
      <input className="w-full border p-2" placeholder="Plano" {...register('planId')} />
      {errors.planId && (
        <p className="text-red-500 text-sm">{errors.planId.message as string}</p>
      )}
      <button type="submit" disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded">
        Cadastrar
      </button>
    </form>
  );
}
