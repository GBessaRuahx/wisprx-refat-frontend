import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '@features/auth/schemas/loginSchema';
import { useLogin } from '@features/auth/hooks/useLogin';

export function LoginForm() {
  const { handleLogin, loading } = useLogin();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(loginSchema) });

  return (
    <form onSubmit={handleSubmit(handleLogin)} className="space-y-4">
      <input
        className="w-full border p-2"
        placeholder="Email"
        {...register('email')}
      />
      {errors.email && (
        <p className="text-red-500 text-sm">{errors.email.message as string}</p>
      )}
      <input
        type="password"
        className="w-full border p-2"
        placeholder="Senha"
        {...register('password')}
      />
      {errors.password && (
        <p className="text-red-500 text-sm">{errors.password.message as string}</p>
      )}
      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Entrar
      </button>
    </form>
  );
}
