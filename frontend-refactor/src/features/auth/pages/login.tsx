import Image from 'next/image';
import { LoginForm } from '@features/auth/forms/LoginForm';
import logo from '@shared/assets/logo.png';
import { useTranslation } from 'react-i18next';
import '@shared/i18n/i18n';

export default function LoginPage() {
  const { t } = useTranslation();
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-sm p-4 bg-white shadow rounded">
        <div className="flex justify-center mb-4">
          <Image src={logo} alt="logo" width={120} height={80} />
        </div>
        <h1 className="text-xl font-bold mb-4">{t('auth.login.title')}</h1>
        <LoginForm />
      </div>
    </div>
  );
}
