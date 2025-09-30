import Link from 'next/link';
import router, { useRouter } from 'next/router';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SearchIcon from '@mui/icons-material/Search';
import LogoutIcon from '@mui/icons-material/Logout';
import CameraIcon from '@mui/icons-material/Camera';
import BreadcrumbAdmin from '@/components/BreadcumbAdmin';
import MeetingSuccessModal from './MeetingSuccessModal';
import MeetingSchedulerModal from './MeetingSchedulerModal';
import ScheduledMeetingsModal from './ScheduledMeetingsModal';
interface AdminData {
          role: string;
          [key: string]: any;
}

export default function Layout({ children, navItems, searchTerm,setSearchTerm }: { children: React.ReactNode, navItems: Array<{ href: string, icon: React.ReactNode, label: string,  }>, searchTerm: string, setSearchTerm: (term: string) => void }) {
  const { pathname } = useRouter();
  const [adminData, setAdminData] = useState<AdminData | null>(null);
  const [showMeetingModal, setShowMeetingModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showScheduledMeetingsModal, setShowScheduledMeetingsModal] = useState(false);
  const [scheduledMeeting, setScheduledMeeting] = useState<any>(null);
  const [showMeetingDropdown, setShowMeetingDropdown] = useState(false);
  console.log("Search Term:", searchTerm);
  // Fetch Data of Admin from local Storage
  useEffect(() => {
    if(sessionStorage.getItem('adminData')){
      const adminDataString = sessionStorage.getItem("adminData");
      if (adminDataString) {
        const parsedData = JSON.parse(adminDataString);
        setAdminData(parsedData);}
    }else{
      const adminDataString = localStorage.getItem("adminData");
    if (adminDataString) {
      const parsedData = JSON.parse(adminDataString);
      setAdminData(parsedData);
    }

    }
    
    }, []);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminData');
    router.push('/admin');
  };  
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
  return (
    <div className="min-h-screen bg-white text-gray-900 flex">

      {/* Side Bar */}
      <aside className=" w-[280px] bg-adminBgChosen text-white flex flex-col  ">
              <div className=' mx-auto'>
                <div className="mt-[48px] text-2xl font-bold"><p className='text-center'>EDURIZON</p></div>
                <nav className="mt-[40px] mb-[228px] flex flex-col gap-[16px]">
                  {navItems.map((item) => (
                    <Link key={item.href} href={item.href}>
                      <button className={`w-[224px] py-[12px] px-[16px] rounded-[4px] text-white flex gap-[12px] hover:bg-adminGreenChosen 
                          ${pathname === item.href ? "bg-adminGreenChosen font-semibold" : "font-medium"}`}>
                        {item.icon} {item.label}
                      </button>
                    </Link>
                  ))}
                </nav>
              </div>
              <div className="mx-auto mt-auto mb-[10vw]">
                <button onClick={handleLogout} className={`w-[224px] py-[12px] px-[16px] rounded-[4px]  text-white bg-[rgba(255,255,255,0.08)]  flex gap-[12px] hover:bg-adminGreenChosen  ${pathname=='/admin/counsellor/create-sessions'?"bg-adminGreenChosen font-semibold":"font-medium"}`}>
                     <LogoutIcon className='w-[24px] h-[24px]' /> Logout
                </button>

                {/* <div className="mt-[76px] text-sm">
                  <div className="flex items-center space-x-2">
                    <img src="https://via.placeholder.com/40" className="rounded-full w-10 h-10" />
                    <div>
                      <div className="font-medium">Username</div>
                      <div className="text-xs text-gray-400">View profile</div>
                    </div>
                  </div>
                </div> */}
              </div>
            </aside>

      {/* Main Content */}
      <main className="flex-1   overflow-auto bg-[#F4F5F7]">

        {/* Navbar */}
        <nav className='border-b-2 items-center border-[#E8E8E8] px-[24px] py-[24px] flex'>
            <h4 className='font-bold text-h5Text'>Hello, {adminData?.firstName}</h4>
            <Image src="/assets/Images/admin/double-chevron-right.svg" width={20} height={20} className='ml-[2vw] w-[1.5vw] h-[1.5vw]' alt='arrow down icon' />
            {/* <h4 className='text-regularText text-[#9F9F9F] ml-[8px] mr-[24px]'>{new Date().toLocaleDateString()}</h4> */}
             <BreadcrumbAdmin  role={adminData?.role}/>
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
                <input type="text" placeholder="Search..." className='w-full  h-full outline-none px-[12px] text-smallText' value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                <SearchIcon className='ml-auto my-auto mr-[12px]' style={{fontSize: '32px', color: '#666666'}}/>
            </div>
        </nav>

        {/* Children */}
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
}


