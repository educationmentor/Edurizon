import axios from 'axios';
import { baseUrl } from '@/lib/baseUrl';
import { getAdminToken } from '@/utils/adminStorage';

declare global {
  interface Window {
    __adminAxiosInterceptorConfigured?: boolean;
  }
}

const shouldAttachAdminToken = (url?: string) => {
  if (!url) return false;
  if (url.startsWith('http')) {
    try {
      const target = new URL(url);
      const base = new URL(baseUrl);
      return target.origin === base.origin;
    } catch {
      return false;
    }
  }
  return url.startsWith('/api/') || url.startsWith(baseUrl);
};

export const setupAdminAxiosInterceptor = () => {
  if (typeof window === 'undefined') return;
  if (window.__adminAxiosInterceptorConfigured) return;

  axios.interceptors.request.use((config:any) => {
    if (typeof window === 'undefined') return config;

    if (!window.location.pathname.includes('/admin')) {
      return config;
    }

    if (!shouldAttachAdminToken(config.url)) {
      return config;
    }

    const token = getAdminToken();
    if (!token) return config;

    const authToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
    return {
      ...config,
      headers: {
        ...config.headers,
        Authorization: authToken,
      },
    };
  });

  window.__adminAxiosInterceptorConfigured = true;
};

