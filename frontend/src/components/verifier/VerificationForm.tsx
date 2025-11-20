import { useState } from 'react';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import { apiService } from '../../services/api';
import { truncateHash } from '../../utils/helpers';
import type { VerificationResult } from '../../types';

export const VerificationForm = () => {
  const [hash, setHash] = useState('');
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [error, setError] = useState('');
  const [verificationType, setVerificationType] = useState<'blockchain' | 'ai' | 'complete'>('blockchain');

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (verificationType !== 'ai' && !hash.trim()) {
      setError('Please enter a certificate hash');
      return;
    }

    if ((verificationType === 'ai' || verificationType === 'complete') && !pdfFile) {
      setError('Please upload a PDF file for AI verification');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      let response: VerificationResult;

      if (verificationType === 'blockchain') {
        response = await apiService.verifyBlockchain(hash);
      } else if (verificationType === 'ai' && pdfFile) {
        response = await apiService.verifyAI(pdfFile);
      } else if (verificationType === 'complete' && pdfFile) {
        response = await apiService.verifyComplete(hash, pdfFile);
      } else {
        throw new Error('Invalid verification type');
      }

      setResult(response);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <Card title="Verify Certificate">
        <form onSubmit={handleVerify} className="space-y-4">
          <div>
            <label className="label">Verification Type</label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="verificationType"
                  value="blockchain"
                  checked={verificationType === 'blockchain'}
                  onChange={(e) => setVerificationType(e.target.value as any)}
                  className="mr-2"
                />
                Blockchain Only
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="verificationType"
                  value="ai"
                  checked={verificationType === 'ai'}
                  onChange={(e) => setVerificationType(e.target.value as any)}
                  className="mr-2"
                />
                AI Forgery Detection
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="verificationType"
                  value="complete"
                  checked={verificationType === 'complete'}
                  onChange={(e) => setVerificationType(e.target.value as any)}
                  className="mr-2"
                />
                Complete Verification
              </label>
            </div>
          </div>

          {verificationType !== 'ai' && (
            <div>
              <label className="label">Certificate Hash</label>
              <input
                type="text"
                placeholder="Enter certificate hash"
                className="input-field"
                value={hash}
                onChange={(e) => setHash(e.target.value)}
              />
            </div>
          )}

          {(verificationType === 'ai' || verificationType === 'complete') && (
            <div>
              <label className="label">Certificate PDF</label>
              <input
                type="file"
                accept=".pdf"
                className="input-field"
                onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
              />
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Verifying...' : 'Verify Certificate'}
          </Button>
        </form>
      </Card>

      {result && (
        <div className="mt-6">
          <Card>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold">Verification Result</h3>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    result.isValid
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {result.isValid ? 'Valid Certificate' : 'Invalid Certificate'}
                </span>
              </div>

              {result.blockchainVerified !== undefined && (
                <div>
                  <p className="text-sm text-gray-600">
                    Blockchain Status:{' '}
                    <span
                      className={result.blockchainVerified ? 'text-green-600' : 'text-red-600'}
                    >
                      {result.blockchainVerified ? 'Verified' : 'Not Found'}
                    </span>
                  </p>
                </div>
              )}

              {result.trustScore !== undefined && (
                <div>
                  <p className="text-sm text-gray-600 mb-2">Trust Score</p>
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div
                      className={`h-4 rounded-full ${
                        result.trustScore >= 80
                          ? 'bg-green-500'
                          : result.trustScore >= 60
                          ? 'bg-yellow-500'
                          : 'bg-red-500'
                      }`}
                      style={{ width: `${result.trustScore}%` }}
                    ></div>
                  </div>
                  <p className="text-right text-sm mt-1">{result.trustScore.toFixed(1)}%</p>
                </div>
              )}

              {result.details && (
                <div className="grid grid-cols-2 gap-3 text-sm">
                  {result.details.ocrScore !== undefined && (
                    <div className="bg-gray-50 p-3 rounded">
                      <p className="font-medium">OCR Score</p>
                      <p className="text-gray-600">{result.details.ocrScore.toFixed(1)}%</p>
                    </div>
                  )}
                  {result.details.layoutScore !== undefined && (
                    <div className="bg-gray-50 p-3 rounded">
                      <p className="font-medium">Layout Score</p>
                      <p className="text-gray-600">{result.details.layoutScore.toFixed(1)}%</p>
                    </div>
                  )}
                  {result.details.logoScore !== undefined && (
                    <div className="bg-gray-50 p-3 rounded">
                      <p className="font-medium">Logo Score</p>
                      <p className="text-gray-600">{result.details.logoScore.toFixed(1)}%</p>
                    </div>
                  )}
                  {result.details.signatureScore !== undefined && (
                    <div className="bg-gray-50 p-3 rounded">
                      <p className="font-medium">Signature Score</p>
                      <p className="text-gray-600">{result.details.signatureScore.toFixed(1)}%</p>
                    </div>
                  )}
                  {result.details.tamperScore !== undefined && (
                    <div className="bg-gray-50 p-3 rounded">
                      <p className="font-medium">Tamper Score</p>
                      <p className="text-gray-600">{result.details.tamperScore.toFixed(1)}%</p>
                    </div>
                  )}
                </div>
              )}

              {result.anomalies && result.anomalies.length > 0 && (
                <div>
                  <p className="font-medium text-sm mb-2">Detected Anomalies:</p>
                  <ul className="list-disc list-inside text-sm text-red-600 space-y-1">
                    {result.anomalies.map((anomaly, idx) => (
                      <li key={idx}>{anomaly}</li>
                    ))}
                  </ul>
                </div>
              )}

              {result.certificate && (
                <div className="border-t pt-4 mt-4">
                  <h4 className="font-semibold mb-2">Certificate Details</h4>
                  <div className="text-sm space-y-1">
                    <p><strong>Student:</strong> {result.certificate.studentName}</p>
                    <p><strong>Course:</strong> {result.certificate.courseName}</p>
                    <p><strong>Institution:</strong> {result.certificate.institutionName}</p>
                    <p><strong>Hash:</strong> {truncateHash(result.certificate.certificateHash)}</p>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
