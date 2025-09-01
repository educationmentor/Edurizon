import { baseUrl } from '@/lib/baseUrl';
import axios from 'axios';

const API_URL = `${baseUrl}/api`;

export const login = async (username: string, password: string) => {
  const response = await axios.post(`${API_URL}/users/login`, { username, password });
  return response.data;
};

export const register = async (userData: any) => {
  const response = await axios.post(`${API_URL}/users/register`, userData);
  return response.data;
};

export const googleAuth = async (tokenId: string) => {
  const response = await axios.post(`${API_URL}/users/google`, { tokenId });
  return response.data;
};

// Leads API functions
export const getLeadsByCounsellor = async (counsellorId: string) => {
  const response = await axios.get(`${API_URL}/leads/get-all-leads-by-counsellor/${counsellorId}`);
  return response.data;
};

export const updateLeadStatus = async (leadId: string, statusData: { callingStatus?: string; leadType?: string; leadStatus?: string }) => {
  const response = await axios.patch(`${API_URL}/leads/${leadId}/update-status`, statusData);
  return response.data;
};

// Registered Students API functions
export const getRegisteredStudentsByCounsellor = async (counsellorId: string) => {
  const response = await axios.get(`${API_URL}/registered-students/get-by-counsellor/${counsellorId}`);
  return response.data;
};