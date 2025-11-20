export interface Certificate {
  id: string;
  certificateHash: string;
  ipfsHash: string;
  blockchainTxHash: string;
  pdfUrl: string;
  courseName: string;
  issueDate: string;
  studentName: string;
  studentId: string;
  institutionName: string;
  institutionId: string;
  metadata?: Record<string, any>;
  createdAt: string;
}

export interface Institution {
  id: string;
  name: string;
  email: string;
  walletAddress: string;
  logoUrl?: string;
  createdAt: string;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  studentId: string;
  createdAt: string;
}

export interface VerificationResult {
  isValid: boolean;
  certificateHash: string;
  blockchainVerified: boolean;
  aiVerified?: boolean;
  trustScore?: number;
  anomalies?: string[];
  details?: {
    ocrScore?: number;
    layoutScore?: number;
    logoScore?: number;
    signatureScore?: number;
    tamperScore?: number;
    contentScore?: number;
  };
  certificate?: Certificate;
}

export interface UploadCertificateRequest {
  studentName: string;
  studentId: string;
  courseName: string;
  issueDate: string;
  pdfFile: File;
  metadata?: Record<string, any>;
}

export interface UploadCertificateResponse {
  success: boolean;
  certificateId: string;
  certificateHash: string;
  ipfsHash: string;
  blockchainTxHash: string;
  pdfUrl: string;
  message: string;
}
