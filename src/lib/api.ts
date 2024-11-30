import axios from 'axios';
import { getSession } from 'next-auth/react';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

api.interceptors.request.use(async (config) => {
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', {
      status: error.response?.status,
      data: error.response?.data,
      headers: error.response?.headers,
    });
    return Promise.reject(error);
  }
);

export const fetchProfile = async () => {
  try {
    const response = await api.get('/api/auth/profile');
    return response.data;
  } catch (error) {
    console.error('Error fetching profile:', error);
    const session = await getSession();
    return session?.user || null;
  }
};

export const registerUser = async (userData: {
  name: string;
  email: string;
  password: string;
}) => {
  try {
    const response = await api.post('/api/auth/register', userData);
    return response.data;
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
};

export const fetchInventory = async (isAdmin: boolean = false) => {
  try {
    const endpoint = isAdmin ? '/api/admin/inventory' : '/api/user/inventory';
    const response = await api.get(endpoint);
    return response.data;
  } catch (error) {
    console.error('Error fetching inventory:', error);
    throw error;
  }
};

export const createLoanRequest = async (data: {
  inventoryId: string;
  kuantitas: number;
}) => {
  try {
    const response = await api.post('/api/user/loan-request', data);
    return response.data;
  } catch (error) {
    console.error('Error creating loan request:', error);
    throw error;
  }
};

export const fetchLoanRequests = async (isAdmin: boolean = false) => {
  try {
    const endpoint = isAdmin
      ? '/api/admin/loan-requests'
      : '/api/user/loan-requests';
    const response = await api.get(endpoint);
    return response.data;
  } catch (error) {
    console.error('Error fetching loan requests:', error);
    throw error;
  }
};

export const register = async (data: {
  name: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
}) => {
  try {
    const response = await api.post('/api/auth/register', {
      ...data,
      role: data.role || 'user',
    });
    return response.data;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

export const updateProfile = async (formData: FormData) => {
  try {
    const response = await api.patch('/api/auth/profile', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
};
