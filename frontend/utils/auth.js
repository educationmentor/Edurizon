import { useRouter } from 'next/router';
import { useEffect } from 'react';

export const getAuthToken = () => {
  if (typeof window === 'undefined') return null;
  
  const userData = localStorage.getItem('user');
  if (!userData) return null;
  
  try {
    const user = JSON.parse(userData);
    return user.token;
  } catch (e) {
    console.error('Failed to parse user data', e);
    return null;
  }
};

export const getUserRole = () => {
  if (typeof window === 'undefined') return null;
  
  const userData = localStorage.getItem('user');
  if (!userData) return null;
  
  try {
    const user = JSON.parse(userData);
    return user.role || 'student'; // Default to student if no role specified
  } catch (e) {
    console.error('Failed to parse user data', e);
    return null;
  }
};

export const useAuth = (requiredRole = null) => {
  const router = useRouter();

  useEffect(() => {
    const token = getAuthToken();
    const userRole = getUserRole();
    
    if (!token) {
      router.push('/auth/login');
      return;
    }

    if (requiredRole && userRole !== requiredRole) {
      router.push('/auth/login');
    }
  }, [router, requiredRole]);
};

export const clearAuth = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('user');
};

export const setAuth = (data) => {
  if (typeof window === 'undefined') return;
  
  const token = data.token && !data.token.startsWith('Bearer ')
    ? `Bearer ${data.token}`
    : data.token;
    
  localStorage.setItem('user', JSON.stringify({
    ...data,
    token,
    role: data.role || 'student' // Ensure role is set
  }));
};