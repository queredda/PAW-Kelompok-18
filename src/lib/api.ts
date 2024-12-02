import axios from 'axios';
import { ReturnCondition, Role } from '@prisma/client';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || '',
  headers: {
    'Content-Type': 'application/json',
  },
});

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

export const updateLoanRequestStatus = async (data: {
  requestNumber: string;
  status: 'Terima' | 'Tolak';
}) => {
  try {
    const response = await api.patch('/api/admin/loan-management', data);
    return response.data;
  } catch (error) {
    console.error('Error updating loan request:', error);
    throw error;
  }
};

export const updateReturnedItem = async (data: {
  requestNumber: string;
  returnedCondition: ReturnCondition;
}) => {
  try {
    const response = await api.patch('/api/admin/returned-items', data);
    return response.data;
  } catch (error) {
    console.error('Error updating returned item:', error);
    throw error;
  }
};

export const fetchLoanRequests = async (isAdmin: boolean = false) => {
  try {
    const endpoint = isAdmin
      ? '/api/admin/loan-management'
      : '/api/user/loan-history';
    const response = await api.get(endpoint);
    return response.data;
  } catch (error) {
    console.error('Error fetching loan requests:', error);
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

export const fetchProfile = async (): Promise<{
  id: string;
  name: string;
  email: string;
  role: Role;
  profilePic: string | null;
}> => {
  try {
    const response = await api.get('/api/auth/profile');
    return response.data;
  } catch (error) {
    console.error('Error fetching profile:', error);
    throw error;
  }
};

interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: 'USER' | 'ADMIN';
}

export const register = async (data: RegisterData) => {
  try {
    const response = await axios.post('/api/auth/register', data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
    throw error;
  }
};
