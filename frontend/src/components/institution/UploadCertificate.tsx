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
      // Extract detailed error message
      const errorMessage = err.response?.data?.detail || 
                          err.response?.data?.message || 
                          err.message || 
                          'Failed to upload certificate';
      
      // Check if it's a blockchain error
      if (errorMessage.includes('Certificate already exists') || 
          errorMessage.includes('already exists')) {
        setError('⚠️ This certificate has already been uploaded to the blockchain. Each certificate can only be issued once.');
      } else {
        setError(errorMessage);
      }
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
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg space-y-3">
              <p className="font-semibold text-lg">✅ {result.message}</p>
              <div className="text-sm space-y-2">
                <div>
                  <strong>Certificate Hash:</strong>
                  <div className="flex gap-2 items-center mt-1">
                    <code className="bg-white px-2 py-1 rounded text-xs break-all flex-1">{result.certificateHash}</code>
                    <button
                      type="button"
                      onClick={() => navigator.clipboard.writeText(result.certificateHash)}
                      className="px-2 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700"
                    >
                      Copy
                    </button>
                  </div>
                </div>
                <div>
                  <strong>IPFS Hash:</strong>
                  <div className="flex gap-2 items-center mt-1">
                    <code className="bg-white px-2 py-1 rounded text-xs break-all flex-1">{result.ipfsHash}</code>
                    <button
                      type="button"
                      onClick={() => navigator.clipboard.writeText(result.ipfsHash)}
                      className="px-2 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700"
                    >
                      Copy
                    </button>
                  </div>
                </div>
                <div>
                  <strong>Blockchain TX:</strong>
                  <div className="flex gap-2 items-center mt-1">
                    <code className="bg-white px-2 py-1 rounded text-xs break-all flex-1">{result.blockchainTxHash}</code>
                    <button
                      type="button"
                      onClick={() => navigator.clipboard.writeText(result.blockchainTxHash)}
                      className="px-2 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700"
                    >
                      Copy
                    </button>
                  </div>
                </div>
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
