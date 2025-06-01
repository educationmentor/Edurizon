import React, { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';
import axios from 'axios';
import { baseUrl } from '@/lib/baseUrl';

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const router = useRouter();
  const [userRole, setUserRole] = useState<string>('');

  const validateToken = async (token: string) => {
    try {
      // Make a request to validate the token
      await axios.get(`${baseUrl}/api/admin/validate-token`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return true;
    } catch (error) {
      // If token is invalid, clear localStorage and redirect to login
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminData');
      return false;
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      // Check for admin token
      const token = localStorage.getItem('adminToken');
      const adminData = localStorage.getItem('adminData');

      if (!token || !adminData) {
        router.push('/admin');
        return;
      }

      // Validate token
      const isValid = await validateToken(token);
      if (!isValid) {
        router.push('/admin');
        return;
      }

      // Get user role from stored admin data
      const { role } = JSON.parse(adminData);
      setUserRole(role);
    };

    checkAuth();
  }, [router]);

  const navigationItems = [
    { 
      name: 'Dashboard', 
      href: '/admin/superadmin', 
      icon: '/assets/Images/admin/overview.svg'
    },
    { 
      name: 'Counsellors', 
      href: '/admin/counsellor', 
      icon: '/assets/Images/admin/session-records.svg'
    },
    { 
      name: 'Documents', 
      href: '/admin/document', 
      icon: '/assets/Images/admin/document.svg'
    },
    { 
      name: 'Finance', 
      href: '/admin/finance', 
      icon: '/assets/Images/admin/finance.svg'
    },
    { 
      name: 'Marketing', 
      href: '/admin/marketing', 
      icon: '/assets/Images/admin/marketing.svg'
    },
    { 
      name: 'Profile', 
      href: '/admin/superadmin/profile', 
      icon: '/assets/Images/admin/profile.svg'
    },
  ];

  // Filter navigation items based on user role
  const filteredNavigation = navigationItems.filter(item => {
    if (userRole === 'super-admin') return true;
    if (userRole === 'counsellor' && item.name.toLowerCase().includes('counsellor')) return true;
    if (userRole === 'documentHandler' && item.name.toLowerCase().includes('document')) return true;
    if (userRole === 'finance' && item.name.toLowerCase().includes('finance')) return true;
    if (userRole === 'digitalMarketing' && item.name.toLowerCase().includes('marketing')) return true;
    return item.name === 'Dashboard' || item.name === 'Profile';
  });

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminData');
    router.push('/admin');
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 flex">
      <aside className="w-[280px] bg-adminBgChosen text-white flex flex-col">
        <div className="mx-auto">
          <div className="mt-[48px] text-2xl font-bold">
            <p className="text-center">EDURIZON</p>
          </div>
          <nav className="mt-[40px] mb-[228px] flex flex-col gap-[16px]">
            {filteredNavigation.map((item) => {
              const isActive = router.pathname === item.href;
              return (
                <Link key={item.name} href={item.href}>
                  <button
                    className={`w-[224px] py-[12px] px-[16px] rounded-[4px] text-white flex gap-[12px] hover:bg-adminGreenChosen ${
                      isActive ? "bg-adminGreenChosen font-semibold" : "font-medium"
                    }`}
                  >
                    <Image
                      src={item.icon}
                      width={40}
                      height={40}
                      className="w-[24px] h-[24px]"
                      alt={`${item.name.toLowerCase()} icon`}
                    />
                    {item.name}
                  </button>
                </Link>
              );
            })}
          </nav>
          <button
            onClick={handleLogout}
            className="w-[224px] py-[12px] px-[16px] rounded-[4px] text-white bg-[rgba(255,255,255,0.08)] flex gap-[12px] hover:bg-adminGreenChosen font-medium"
          >
            <Image
              src="/assets/Images/admin/logout.svg"
              width={40}
              height={40}
              className="w-[24px] h-[24px]"
              alt="logout icon"
            />
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 space-y-6 overflow-auto">{children}</main>
    </div>
  );
};

export default AdminLayout; 