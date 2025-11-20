import axios, { type AxiosInstance } from 'axios';
import { API_BASE_URL } from '../utils/constants';
import type {
  Certificate,
  UploadCertificateRequest,
  UploadCertificateResponse,
  VerificationResult,
} from '../types';

class ApiService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  // Institution APIs
  async uploadCertificate(data: UploadCertificateRequest): Promise<UploadCertificateResponse> {
    const formData = new FormData();
    formData.append('pdfFile', data.pdfFile);
    formData.append('studentName', data.studentName);
    formData.append('studentId', data.studentId);
    formData.append('courseName', data.courseName);
    formData.append('issueDate', data.issueDate);
    if (data.metadata) {
      formData.append('metadata', JSON.stringify(data.metadata));
    }

    const response = await this.client.post<UploadCertificateResponse>(
      '/institution/certificates',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  }

  async getInstitutionCertificates(): Promise<Certificate[]> {
    const response = await this.client.get<Certificate[]>('/institution/certificates');
    return response.data;
  }

  async getCertificateById(id: string): Promise<Certificate> {
    const response = await this.client.get<Certificate>(`/institution/certificates/${id}`);
    return response.data;
  }

  // Student APIs
  async getStudentCertificates(studentId: string): Promise<Certificate[]> {
    const response = await this.client.get<Certificate[]>(`/student/certificates/${studentId}`);
    return response.data;
  }

  async getStudentPortfolio(studentId: string): Promise<{ student: any; certificates: Certificate[] }> {
    const response = await this.client.get(`/student/portfolio/${studentId}`);
    return response.data;
  }

  async downloadCertificate(certificateId: string): Promise<Blob> {
    const response = await this.client.get(`/student/certificate/${certificateId}/download`, {
      responseType: 'blob',
    });
    return response.data;
  }

  // Verifier APIs
  async verifyBlockchain(hash: string): Promise<VerificationResult> {
    const response = await this.client.post<VerificationResult>('/verify/blockchain', { hash });
    return response.data;
  }

  async verifyAI(pdfFile: File): Promise<VerificationResult> {
    const formData = new FormData();
    formData.append('pdfFile', pdfFile);

    const response = await this.client.post<VerificationResult>('/verify/ai', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  async verifyComplete(hash: string, pdfFile: File): Promise<VerificationResult> {
    const formData = new FormData();
    formData.append('hash', hash);
    formData.append('pdfFile', pdfFile);

    const response = await this.client.post<VerificationResult>('/verify/complete', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  async getCertificateByHash(hash: string): Promise<Certificate> {
    const response = await this.client.get<Certificate>(`/verify/certificate/${hash}`);
    return response.data;
  }
}

export const apiService = new ApiService();
