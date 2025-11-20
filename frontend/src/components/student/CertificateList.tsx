import { useState } from 'react';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import { apiService } from '../../services/api';
import { formatDate, truncateHash, downloadFile } from '../../utils/helpers';
import type { Certificate } from '../../types';

export const CertificateList = () => {
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

  const handleDownload = async (certId: string, courseName: string) => {
    try {
      const blob = await apiService.downloadCertificate(certId);
      const url = URL.createObjectURL(blob);
      downloadFile(url, `${courseName}_certificate.pdf`);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download failed:', err);
    }
  };

  const getShareLink = (_certId: string) => {
    return `${window.location.origin}/portfolio/${studentId}`;
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

                <div className="text-xs text-gray-500 mb-3">
                  <p>Hash: {truncateHash(cert.certificateHash)}</p>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => handleDownload(cert.id, cert.courseName)}
                    variant="primary"
                  >
                    Download
                  </Button>
                  <Button
                    onClick={() => {
                      navigator.clipboard.writeText(getShareLink(cert.id));
                      alert('Portfolio link copied!');
                    }}
                    variant="secondary"
                  >
                    Share Portfolio
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};
