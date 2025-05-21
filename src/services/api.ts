import axios, { AxiosError } from 'axios';
import type { AuthResponse,  } from '../types/auth';
import type { Product } from '../types/products';
// import type { JobPosting } from '../types/job';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public data?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log('Making request to:', config.url);
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(new ApiError('Request failed', undefined, error));
  }
);

// Add response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    console.log('Response received:', response.status);
    return response;
  },
  (error: AxiosError) => {
    if (error.response) {
      const message = (error.response.data as { message?: string })?.message || 'An error occurred';
      return Promise.reject(new ApiError(message, error.response.status, error.response.data));
    }
    if (error.request) {
      return Promise.reject(new ApiError('No response received from server'));
    }
    return Promise.reject(new ApiError('Request failed'));
  }
);

// Auth endpoints
export const auth = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', { email, password });
    return response.data;
  },
  register: async (data: { name: string; email: string; password: string; role: string }): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/register', data);
    return response.data;
  },
};
type ProductResponse = {
  products: Product[];
  total: number;
};
export const product ={
  create: async (data: Omit<Product, "id" | "createdBy">): Promise<Product> => {
    const response = await api.post<Product>('/product', data);
    return response.data;
  },
  getAll: async (page: number, pageSize: number = 5): Promise<ProductResponse> => {
    const response = await api.get<ProductResponse>('/product', {
      params: {
        limit: pageSize,
        offset: (page - 1) * pageSize
      }
    });
    return response.data;
  },
  getAdminProducts: async (): Promise<Product[]> => {
    const response = await api.get<Product[]>('/product/admin');
    return response.data;
  },
  getProductById: async (id:number): Promise<Product> => {
    const response = await api.get<Product>(`/product/${id}`);
    return response.data;
  },
  update: async (id: number, data: Partial<Product>): Promise<Product> => {
    const response = await api.put<Product>(`/product/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/product/${id}`);
  }
}

// Job endpoints
// export const jobs = {
//   getJobs: async (): Promise<JobPosting[]> => {
//     const response = await api.get<JobPosting[]>('/jobs');
//     return response.data;
//   },
//   getEmployerJobs: async (employerId: string): Promise<JobPosting[]> => {
//     const response = await api.get<JobPosting[]>(`/jobs/employer/${employerId}`);
//     return response.data;
//   },
//   getJob: async (id: string): Promise<JobPosting> => {
//     const response = await api.get<JobPosting>(`/jobs/${id}`);
//     return response.data;
//   },
//   createJob: async (job: Partial<JobPosting>): Promise<JobPosting> => {
//     const response = await api.post<JobPosting>('/jobs', job);
//     return response.data;
//   },
//   updateJob: async (id: string, job: Partial<JobPosting>): Promise<JobPosting> => {
//     const response = await api.put<JobPosting>(`/jobs/${id}`, job);
//     return response.data;
//   },
//   deleteJob: async (id: string): Promise<void> => {
//     await api.delete(`/jobs/${id}`);
//   },
// };

// Matching endpoints
// export const matches = {
//   getCandidateMatches: async (userId: string): Promise<Match[]> => {
//     const response = await api.get<Match[]>(`/matches/candidate/${userId}`);
//     return response.data;
//   },
//   getJobMatches: async (jobId: string): Promise<Match[]> => {
//     const response = await api.get<Match[]>(`/matches/job/${jobId}`);
//     return response.data;
//   },
// };

export default api; 