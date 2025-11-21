import { AuthForm } from '../components/auth/AuthForm';

export const Auth = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Institution Portal</h1>
      <AuthForm />
    </div>
  );
};
