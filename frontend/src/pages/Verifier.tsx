import { useNavigate } from 'react-router-dom';
import { VerificationForm } from '../components/verifier/VerificationForm';
import { ErrorBoundary } from '../components/common/ErrorBoundary';
import { Button } from '../components/common/Button';

export const Verifier = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Button variant="secondary" onClick={() => navigate('/')}>
          ← Back
        </Button>
      </div>
      <h1 className="text-3xl font-bold mb-8">Verifier Portal</h1>
      <ErrorBoundary>
        <VerificationForm />
      </ErrorBoundary>
    </div>
  );
};
