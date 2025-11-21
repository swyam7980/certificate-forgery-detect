import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import { apiService } from '../../services/api';
import { formatDate, truncateHash } from '../../utils/helpers';
import { ROUTES } from '../../utils/constants';
import type { Certificate } from '../../types';

export const CertificateList = () => {
  const navigate = useNavigate();
  const [studentId, setStudentId] = useState('');
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!studentId.trim()) {
      setError('Please enter a student ID');
      return;
    }

    setLoading(true);
    setError('');
    setCertificates([]);
    setSearched(false);

    try {
      const data = await apiService.getStudentCertificates(studentId);
      setCertificates(data);
      setSearched(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch certificates');
      setSearched(true);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCertificate = (certificateHash: string) => {
    // Navigate to verifier with hash as URL parameter
    navigate(`${ROUTES.VERIFIER}?hash=${encodeURIComponent(certificateHash)}`);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card title="My Certificates">
        <form onSubmit={handleSearch} className="mb-6">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Enter your Student ID"
              className="input-field flex-1"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
            />
            <Button type="submit" disabled={loading}>
              {loading ? 'Searching...' : 'Search'}
            </Button>
          </div>
        </form>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {searched && certificates.length === 0 && !error && (
          <p className="text-gray-500 text-center py-8">No certificates found for this student ID</p>
        )}

        {certificates.length > 0 && (
          <div className="space-y-4">
            {certificates.map((cert) => (
              <div key={cert.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-lg">{cert.courseName}</h3>
                    <p className="text-gray-600 text-sm">
                      Issued by: {cert.institutionName}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Date: {formatDate(cert.issueDate)}
                    </p>
                  </div>
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                    Verified
                  </span>
                </div>

                <div className="space-y-3 mb-4">
                  <div>
                    <p className="text-xs text-gray-600 font-medium mb-1">Certificate Hash:</p>
                    <div className="flex gap-2 items-center">
                      <code className="bg-gray-100 px-2 py-1 rounded text-xs break-all flex-1">
                        {cert.certificateHash}
                      </code>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(cert.certificateHash);
                          alert('Hash copied to clipboard!');
                        }}
                        className="px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 whitespace-nowrap"
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 font-medium mb-1">Blockchain TX:</p>
                    <div className="flex gap-2 items-center">
                      <code className="bg-gray-100 px-2 py-1 rounded text-xs break-all flex-1">
                        {cert.blockchainTxHash}
                      </code>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(cert.blockchainTxHash);
                          alert('Transaction hash copied!');
                        }}
                        className="px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 whitespace-nowrap"
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => handleVerifyCertificate(cert.certificateHash)}
                    variant="primary"
                  >
                    Verify Certificate
                  </Button>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(cert.certificateHash);
                      alert('Certificate hash copied to clipboard!');
                    }}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Copy Hash
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};
