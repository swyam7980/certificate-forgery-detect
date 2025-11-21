import axios, { type AxiosInstance } from 'axios';
import { API_BASE_URL } from '../utils/constants';
import type {
  Certificate,
  UploadCertificateRequest,
  UploadCertificateResponse,
  VerificationResult,
  LoginResponse,
  SignupRequest,
  SignupResponse
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

    // Add request interceptor to include auth token
    this.client.interceptors.request.use((config) => {
      const token = localStorage.getItem('access_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Add response interceptor to handle auth errors
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Token expired or invalid, redirect to login
          localStorage.removeItem('access_token');
          localStorage.removeItem('institution');
          window.location.href = '/auth';
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth APIs
  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await this.client.post<LoginResponse>('/auth/login', { email, password });
    return response.data;
  }

  async signup(data: SignupRequest): Promise<SignupResponse> {
    const response = await this.client.post<SignupResponse>('/auth/signup', data);
    return response.data;
  }

  async logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('institution');
  }

  // Institution APIs
  async uploadCertificate(data: UploadCertificateRequest): Promise<UploadCertificateResponse> {
    const formData = new FormData();
    formData.append('pdfFile', data.pdfFile);
    formData.append('student_name', data.studentName);
    formData.append('student_id', data.studentId);
    formData.append('course_name', data.courseName);
    formData.append('issue_date', data.issueDate);
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
    const response = await this.client.get<Certificate[]>(`/student/${studentId}/certificates`);
    return response.data;
  }

  async getStudentPortfolio(studentId: string): Promise<{ student: any; certificates: Certificate[] }> {
    const response = await this.client.get(`/student/${studentId}/portfolio`);
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
    const response = await this.client.post<VerificationResult>('/verifier/blockchain', { hash });
    return response.data;
  }

  async verifyAI(pdfFile: File): Promise<VerificationResult> {
    const formData = new FormData();
    formData.append('pdfFile', pdfFile);

    const response = await this.client.post<VerificationResult>('/verifier/ai', formData, {
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

    const response = await this.client.post<VerificationResult>('/verifier/complete', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  async getCertificateByHash(hash: string): Promise<Certificate> {
    const response = await this.client.get<Certificate>(`/verifier/certificate/${hash}`);
    return response.data;
  }
}

export const apiService = new ApiService();
