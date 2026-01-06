import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { baseUrl } from '@/lib/baseUrl';

export const useUserData = () => {
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  const fetchUserData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Get user data from localStorage
      const storedUserData = localStorage.getItem('user');
      if (!storedUserData) {
        router.push('/login');
        return;
      }

      const user = JSON.parse(storedUserData);
      
      // Check if user is a registered student
      if (user.role !== 'registered-student') {
        router.push('/');
        return;
      }

      // Fetch fresh data from API
      const response = await axios.get(`${baseUrl}/api/registered-students/profile`, {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      });

      if (response.data.success) {
        const updatedUserData = {
          ...response.data.data,
          token: user.token // Keep the existing token
        };
        
        // Update localStorage with fresh data
        localStorage.setItem('user', JSON.stringify(updatedUserData));
        setUserData(updatedUserData);
      } else {
        throw new Error('Failed to fetch user data');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      setError(error.message);
      
      // If token is invalid or expired, redirect to login
      if (error.response?.status === 401) {
        localStorage.removeItem('user');
        router.push('/login');
      }
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  const refetchUserData = useCallback(() => {
    fetchUserData();
  }, [fetchUserData]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  return {
    userData,
    isLoading,
    error,
    refetchUserData
  };
};

