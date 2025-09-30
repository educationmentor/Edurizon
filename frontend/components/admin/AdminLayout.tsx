import React, { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';
import axios from 'axios';
import { baseUrl } from '@/lib/baseUrl';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SearchIcon from '@mui/icons-material/Search';
import LogoutIcon from '@mui/icons-material/Logout';
import BreadcrumbAdmin from '../BreadcumbAdmin';
import PersonIcon from '@mui/icons-material/Person';
import PeopleIcon from '@mui/icons-material/People';
import DescriptionIcon from '@mui/icons-material/Description';
import LanguageIcon from '@mui/icons-material/Language';
import GridViewIcon from '@mui/icons-material/GridView';
import CameraIcon from '@mui/icons-material/Camera';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import MeetingSuccessModal from './MeetingSuccessModal';
import MeetingSchedulerModal from './MeetingSchedulerModal';
import ScheduledMeetingsModal from './ScheduledMeetingsModal';

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const router = useRouter();
  const [userRole, setUserRole] = useState<string>('');
  const [adminData, setAdminData] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showMeetingModal, setShowMeetingModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showScheduledMeetingsModal, setShowScheduledMeetingsModal] = useState(false);
  const [scheduledMeeting, setScheduledMeeting] = useState<any>(null);
  const [showMeetingDropdown, setShowMeetingDropdown] = useState(false);

  useEffect(() => {
    const adminDataString = localStorage.getItem("adminData");
    if (adminDataString) {
      const parsedData = JSON.parse(adminDataString);
      setAdminData(parsedData);
    }
  }, []);

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

  const handleMeetingSuccess = (meeting: any) => {
    setScheduledMeeting(meeting);
    setShowSuccessModal(true);
  };

  // Close dropdown when clicking outside (but not on hover)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.meeting-dropdown-container')) {
        setShowMeetingDropdown(false);
      }
    };

    if (showMeetingDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMeetingDropdown]);

  const navigationItems = [
    { 
      name: 'Dashboard', 
      href: '/admin/superadmin', 
      icon: <GridViewIcon />
    },
    { 
      name: 'Counsellor Admin', 
      href: '/admin/counsellor-admin', 
      icon: <PersonIcon />
    },
    { 
      name: 'Counsellors', 
      href: '/admin/counsellor', 
      icon: <PeopleIcon />
    },
    { 
      name: 'Documents', 
      href: '/admin/document', 
      icon: <DescriptionIcon />
    },
    {
      name: 'Digital Team',
      href: '/admin/digital',
      icon: <LanguageIcon />
    },
    {
      name: 'Finance Admin',
      href: '/admin/finance',
      icon: <AccountBalanceWalletIcon />
    }
  ];

  // Filter navigation items based on user role
  const filteredNavigation = navigationItems.filter(item => {
    if (userRole === 'super-admin') return true;
    if (userRole === 'counsellor' && item.name.toLowerCase().includes('counsellor')) return true;
    if (userRole === 'documentHandler' && item.name.toLowerCase().includes('document')) return true;
    if (userRole === 'finance' && item.name.toLowerCase().includes('finance')) return true;
    if (userRole === 'digitalMarketing' && item.name.toLowerCase().includes('marketing')) return true;
    if (userRole === 'finance' && item.name.toLowerCase().includes('finance')) return true;
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
        <div className="mx-auto h-full flex flex-col justify-between py-[48px]">
          <div>
            <div className="text-2xl font-bold">
              <p className="text-center">EDURIZON</p>
            </div>
            <nav className="mt-[40px] flex flex-col gap-[16px]">
              {filteredNavigation.map((item) => {
                const isActive = router.pathname === item.href;
                return (
                  <Link key={item.name} href={item.href}>
                    <button
                      className={`w-[224px] py-[12px] px-[16px] rounded-[4px] text-white flex gap-[12px] hover:bg-adminGreenChosen ${
                        isActive ? "bg-adminGreenChosen font-semibold" : "font-medium"
                      }`}
                    >
                      {item.icon}
                      {item.name}
                    </button>
                  </Link>
                );
              })}
            </nav>
          </div>
          <button
            onClick={handleLogout}
            className="w-[224px] py-[12px] px-[16px] mb-[100px] rounded-[4px] text-white bg-[rgba(255,255,255,0.08)] flex gap-[12px] hover:bg-adminGreenChosen font-medium"
          >
            <LogoutIcon className='w-[24px] h-[24px]' /> 
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto bg-[#F4F5F7]" >
        <nav className='border-b-2 items-center border-[#E8E8E8] px-[24px] py-[24px] flex'>
          <h4 className='font-bold text-h5Text'>Hello, {adminData?.firstName}</h4>
          <Image src="/assets/Images/admin/double-chevron-right.svg" width={20} height={20} className='ml-[2vw] w-[1.5vw] h-[1.5vw]' alt='arrow down icon' />
          <BreadcrumbAdmin role={adminData?.role}/>
          <NotificationsIcon className='ml-auto' style={{fontSize: '40px', color: '#666666' }} />
          <div 
            className="relative meeting-dropdown-container ml-[16px] group"
            onMouseEnter={() => setShowMeetingDropdown(true)}
            onMouseLeave={() => setShowMeetingDropdown(false)}
          >
            <CameraIcon 
              className='cursor-pointer hover:opacity-80 transition-opacity' 
              style={{fontSize: '40px', color: '#666666' }}
              onClick={() => setShowMeetingDropdown(!showMeetingDropdown)}
            />
            
            {/* Dropdown Menu */}
            {showMeetingDropdown && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                <div className="py-1">
                  <button
                    onClick={() => {
                      setShowMeetingModal(true);
                      setShowMeetingDropdown(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span>Schedule Meeting</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowScheduledMeetingsModal(true);
                      setShowMeetingDropdown(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>View Scheduled Meetings</span>
                  </button>
                </div>
              </div>
            )}
          </div>
          <div className='ml-[32px] w-[340px] bg-white rounded-[16px]  h-[48px] overflow-hidden flex'>
            <input 
              type="text" 
              placeholder="Search..." 
              className='w-full  h-full outline-none px-[12px] text-smallText' 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
            />
            <SearchIcon className='ml-auto my-auto mr-[12px]' style={{fontSize: '32px', color: '#666666'}}/>
          </div>
        </nav>  
        {children}

        {/* Meeting Scheduler Modal */}
        <MeetingSchedulerModal
          isOpen={showMeetingModal}
          onClose={() => setShowMeetingModal(false)}
          onSuccess={handleMeetingSuccess}
          adminData={adminData}
        />

        {/* Meeting Success Modal */}
        <MeetingSuccessModal
          isOpen={showSuccessModal}
          onClose={() => setShowSuccessModal(false)}
          scheduledMeeting={scheduledMeeting}
        />

        {/* Scheduled Meetings Modal */}
        <ScheduledMeetingsModal
          isOpen={showScheduledMeetingsModal}
          onClose={() => setShowScheduledMeetingsModal(false)}
          adminData={adminData}
        />
      </main>
    </div>
  );
};

export default AdminLayout; 