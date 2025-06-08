import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '@features/auth/schemas/loginSchema';
import { useLogin } from '@features/auth/hooks/useLogin';
import { useTranslation } from 'react-i18next';
import '@shared/i18n/i18n';

export function LoginForm() {
  const { handleLogin, loading } = useLogin();
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(loginSchema) });

  return (
    <form onSubmit={handleSubmit(handleLogin)} className="space-y-4">
      <input
        className="w-full border p-2"
        placeholder={t('auth.login.form.email')}
        {...register('email')}
      />
      {errors.email && (
        <p className="text-red-500 text-sm">{errors.email.message as string}</p>
      )}
      <input
        type="password"
        className="w-full border p-2"
        placeholder={t('auth.login.form.password')}
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
        {t('auth.login.buttons.submit')}
      </button>
    </form>
  );
}
