import { LoginForm } from '@features/auth/forms/LoginForm';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-sm p-4 bg-white shadow rounded">
        <h1 className="text-xl font-bold mb-4">Login</h1>
        <LoginForm />
      </div>
    </div>
  );
}
