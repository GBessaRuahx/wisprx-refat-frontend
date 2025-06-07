import { SignupForm } from '../forms/SignupForm';

export default function SignupPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md p-4 bg-white shadow rounded">
        <h1 className="text-xl font-bold mb-4">Cadastro</h1>
        <SignupForm />
      </div>
    </div>
  );
}
