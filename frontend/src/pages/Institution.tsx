import { useState, useEffect } from 'react';
import { UploadCertificate } from '../components/institution/UploadCertificate';
import { CertificateDashboard } from '../components/institution/CertificateDashboard';
import { Button } from '../components/common/Button';

export const Institution = () => {
  const [activeTab, setActiveTab] = useState<'upload' | 'dashboard'>('upload');
  const [institutionName, setInstitutionName] = useState('');

  useEffect(() => {
    const institution = localStorage.getItem('institution');
    if (institution) {
      try {
        const institutionData = JSON.parse(institution);
        setInstitutionName(institutionData.name || '');
      } catch (error) {
        console.error('Error parsing institution data:', error);
      }
    }
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Institution Portal</h1>
        {institutionName && (
          <p className="text-lg text-gray-600 mt-2">Welcome, {institutionName}</p>
        )}
      </div>

      <div className="mb-6 flex gap-4">
        <Button
          variant={activeTab === 'upload' ? 'primary' : 'secondary'}
          onClick={() => setActiveTab('upload')}
        >
          Upload Certificate
        </Button>
        <Button
          variant={activeTab === 'dashboard' ? 'primary' : 'secondary'}
          onClick={() => setActiveTab('dashboard')}
        >
          View Dashboard
        </Button>
      </div>

      {activeTab === 'upload' ? <UploadCertificate /> : <CertificateDashboard />}
    </div>
  );
};
