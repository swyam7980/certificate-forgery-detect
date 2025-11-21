import { VerificationForm } from '../components/verifier/VerificationForm';
import { ErrorBoundary } from '../components/common/ErrorBoundary';

export const Verifier = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">Verifier Portal</h1>
      <ErrorBoundary>
        <VerificationForm />
      </ErrorBoundary>
    </div>
  );
};
