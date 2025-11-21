import { useNavigate } from 'react-router-dom';
import { CertificateList } from '../components/student/CertificateList';
import { Button } from '../components/common/Button';

export const Student = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Button variant="secondary" onClick={() => navigate('/')}>
          ← Back
        </Button>
      </div>
      <h1 className="text-3xl font-bold mb-8">Student Portal</h1>
      <CertificateList />
    </div>
  );
};
