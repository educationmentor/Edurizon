import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import axios from 'axios';
import { baseUrl } from '@/lib/baseUrl';

const AdminLogin = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  

  
  useEffect(() => {
    // Check if redirected due to expired token
    localStorage.removeItem('theme');
    const expired = router.query.expired === 'true';
    if (expired) {
      setError('Your session has expired. Please login again.');
    }

    // Check if already logged in with valid token
    const checkAuth = async () => {
      const tokenLocalStorage = localStorage.getItem('adminToken');
      const adminDataLocalStorage = localStorage.getItem('adminData');
      const tokenSessionStoarge =sessionStorage.getItem('adminToken');
      const adminDataSessionStorage = sessionStorage.getItem('adminData');


      if (tokenLocalStorage && adminDataLocalStorage) {
        try {
          // Validate token
          const response = await axios.get(`${baseUrl}/api/admin/validate-token`, {
            headers: {
              Authorization: `Bearer ${tokenLocalStorage}`
            }
          });
          
          if (response.data.status === 'success') {
            if(adminDataSessionStorage && tokenSessionStoarge){
              const user = JSON.parse(adminDataSessionStorage);
              handleRoleBasedRouting(user.role);
            }else{
              const user = JSON.parse(adminDataLocalStorage);
              handleRoleBasedRouting(user.role);
            }
            
          }
        } catch (error) {
          // Clear invalid token and data
          localStorage.removeItem('adminToken');
          localStorage.removeItem('adminData');
          setError('Session expired. Please login again.');
        }
      }
    };

    checkAuth();
  }, [router]);

  const handleRoleBasedRouting = (role: string) => {
    switch (role) {
      case 'super-admin':
        router.push('/admin/superadmin');
        break;
      case 'counsellor':
        router.push('/admin/counsellor');
        break;
      case 'documentHandler':
        router.push('/admin/document');
        break;
      case 'finance':
        router.push('/admin/finance');
        break;
      case 'digitalMarketing':
        router.push('/admin/digital');
        break;
      case 'counsellorAdmin':
        router.push('/admin/counsellor-admin');
        break;
      default:
        setError('Invalid role. Please contact administrator.');
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminData');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(''); // Clear error when user types
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(`${baseUrl}/api/admin/login`, formData);
      
      if (response.data.status === 'success') {
        const { token, data: { user } } = response.data;

        // Check if account is active
        if (!user.active) {
          setError('Your account has been deactivated. Please contact the super admin.');
          return;
        }

        // Store token and user data
        localStorage.setItem('adminToken', token);
        localStorage.setItem('adminData', JSON.stringify(user));

        // Route based on role
        handleRoleBasedRouting(user.role);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Edurizon Admin Login
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="mt-1 appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-teal-500 focus:border-teal-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
              />
            </div>
            <div className="mb-4 relative">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="mt-1 appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-teal-500 focus:border-teal-500 focus:z-10 sm:text-sm"
                  placeholder="Password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <VisibilityOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Visibility className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center bg-red-50 p-3 rounded-md">
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;