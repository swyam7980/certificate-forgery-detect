import { useEffect, useState } from 'react';
import { Card } from '../common/Card';
import { apiService } from '../../services/api';
import { formatDate, truncateHash } from '../../utils/helpers';
import type { Certificate } from '../../types';

export const CertificateDashboard = () => {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadCertificates();
  }, []);

  const loadCertificates = async () => {
    try {
      const data = await apiService.getInstitutionCertificates();
      setCertificates(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load certificates');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading certificates...</div>;
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Issued Certificates</h2>
      
      {certificates.length === 0 ? (
        <Card>
          <p className="text-gray-500 text-center py-8">No certificates issued yet</p>
        </Card>
      ) : (
        <div className="grid gap-4">
          {certificates.map((cert) => (
            <Card key={cert.id}>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg">{cert.courseName}</h3>
                  <p className="text-gray-600 mt-1">Student: {cert.studentName}</p>
                  <p className="text-sm text-gray-500">ID: {cert.studentId}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Issued: {formatDate(cert.issueDate)}
                  </p>
                </div>
                <div className="text-right text-sm space-y-2">
                  <div>
                    <p className="text-gray-600 font-medium mb-1">Certificate Hash:</p>
                    <div className="flex gap-2 items-center">
                      <code className="bg-gray-100 px-2 py-1 rounded text-xs break-all">
                        {cert.certificateHash}
                      </code>
                      <button
                        onClick={() => navigator.clipboard.writeText(cert.certificateHash)}
                        className="px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 whitespace-nowrap"
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-600 font-medium mb-1">Blockchain TX:</p>
                    <div className="flex gap-2 items-center">
                      <code className="bg-gray-100 px-2 py-1 rounded text-xs break-all">
                        {cert.blockchainTxHash}
                      </code>
                      <button
                        onClick={() => navigator.clipboard.writeText(cert.blockchainTxHash)}
                        className="px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 whitespace-nowrap"
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
