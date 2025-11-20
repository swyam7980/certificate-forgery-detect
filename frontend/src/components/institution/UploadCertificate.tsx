import { useState } from 'react';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import { apiService } from '../../services/api';
import type { UploadCertificateRequest, UploadCertificateResponse } from '../../types';

export const UploadCertificate = () => {
  const [formData, setFormData] = useState({
    studentName: '',
    studentId: '',
    courseName: '',
    issueDate: '',
  });
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<UploadCertificateResponse | null>(null);
  const [error, setError] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!pdfFile) {
      setError('Please select a PDF file');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const request: UploadCertificateRequest = {
        ...formData,
        pdfFile,
      };

      const response = await apiService.uploadCertificate(request);
      setResult(response);
      
      // Reset form
      setFormData({
        studentName: '',
        studentId: '',
        courseName: '',
        issueDate: '',
      });
      setPdfFile(null);
      
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to upload certificate');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card title="Upload Certificate">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Student Name</label>
            <input
              type="text"
              className="input-field"
              value={formData.studentName}
              onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="label">Student ID</label>
            <input
              type="text"
              className="input-field"
              value={formData.studentId}
              onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="label">Course Name</label>
            <input
              type="text"
              className="input-field"
              value={formData.courseName}
              onChange={(e) => setFormData({ ...formData, courseName: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="label">Issue Date</label>
            <input
              type="date"
              className="input-field"
              value={formData.issueDate}
              onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="label">Certificate PDF</label>
            <input
              type="file"
              accept=".pdf"
              className="input-field"
              onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
              required
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {result && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg space-y-2">
              <p className="font-semibold">{result.message}</p>
              <div className="text-sm space-y-1">
                <p><strong>Certificate Hash:</strong> {result.certificateHash.substring(0, 20)}...</p>
                <p><strong>IPFS Hash:</strong> {result.ipfsHash.substring(0, 20)}...</p>
                <p><strong>Blockchain TX:</strong> {result.blockchainTxHash.substring(0, 20)}...</p>
              </div>
            </div>
          )}

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Uploading...' : 'Upload Certificate'}
          </Button>
        </form>
      </Card>
    </div>
  );
};
