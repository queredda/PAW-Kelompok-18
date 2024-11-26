import axios, { AxiosError } from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
});

export const fetchProfile = async (accessToken: string) => {
  console.log('Attempting to fetch profile with token:', accessToken);
  console.log('Using base URL:', process.env.NEXT_PUBLIC_BACKEND_URL);

  try {
    const response = await api.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/profile`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    console.log('Raw API Response:', response);
    console.log('Profile data:', response.data);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        headers: error.response?.headers
      });
    }
    throw error;
  }
}; 