import router from 'next/router';
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import SpaceDashboardRoundedIcon from '@mui/icons-material/SpaceDashboardRounded';
import PaymentsRoundedIcon from '@mui/icons-material/PaymentsRounded';
import SchoolRoundedIcon from '@mui/icons-material/SchoolRounded';
import ChatBubbleRoundedIcon from '@mui/icons-material/ChatBubbleRounded';
import FileCopyRoundedIcon from '@mui/icons-material/FileCopyRounded';
import ArticleRoundedIcon from '@mui/icons-material/ArticleRounded';
import VideoCallRoundedIcon from '@mui/icons-material/VideoCallRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import Dashboard from '@/components/student-dashboard/dashboard';
import LanguageCourses from '@/components/student-dashboard/language-courses';
import ApplicationStatus from '@/components/student-dashboard/application-status';
import Fees from '@/components/student-dashboard/fees-structure'

import { SearchIcon } from 'lucide-react';
import NotificationsActiveRoundedIcon from '@mui/icons-material/NotificationsActiveRounded';
import Documents from '@/components/student-dashboard/documents';
import { useUserData } from '@/hooks/useUserData';
import Chat from '@/components/student-dashboard/chat';
import Meetings from '../components/student-dashboard/meetings';
import axios from 'axios';
import { baseUrl } from '@/lib/baseUrl';
const dashboardItems=[
  { id: 'dashboard', label: 'Dashboard', icon: SpaceDashboardRoundedIcon },
  { id: 'fee-structure', label: 'Fees Info', icon: PaymentsRoundedIcon },
  { id: 'application-status', label: 'Application Status', icon: SchoolRoundedIcon },
  { id: 'chat-support', label: 'Chat Support', icon: ChatBubbleRoundedIcon },
  { id: 'documents', label: 'Documents', icon: FileCopyRoundedIcon },
  { id: 'language-courses', label: 'Language Courses', icon: ArticleRoundedIcon },
  { id: 'meetings', label: 'Meetings', icon: VideoCallRoundedIcon },
]

interface StudentNotification {
  _id?: string;
  message: string;
  sentAt: string;
  isRead: boolean;
  senderId?: string;
}

const StudentDashboard = () => {
  const { userData, isLoading, error, refetchUserData } = useUserData();
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [notifications, setNotifications] = useState<StudentNotification[]>([]);
  const [notificationsLoading, setNotificationsLoading] = useState<boolean>(false);
  const studentToken = (userData as any)?.token;
  const unreadCount = notifications.filter((notification) => !notification.isRead).length;
  const studentNotificationsFromProfile = (userData as any)?.notifications;


  const applyLocalNotifications = (source: any) => {
    if (!source || !Array.isArray(source)) {
      setNotifications([]);
      return;
    }

    // Filter out read notifications and normalize
    const normalized = source
      .filter((notification: any) => !notification.isRead) // Only show unread notifications
      .map((notification: any) => ({
        ...notification,
        sentAt: notification.sentAt || new Date().toISOString(),
        isRead: Boolean(notification.isRead),
      }))
      .sort(
        (a: StudentNotification, b: StudentNotification) =>
          new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime()
      );

    setNotifications(normalized);
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!studentToken) {
        applyLocalNotifications(studentNotificationsFromProfile);
        return;
      }

      setNotificationsLoading(true);
      try {
        const response = await axios.get(`${baseUrl}/api/student/notifications`, {
          headers: {
            Authorization: `Bearer ${studentToken}`
          }
        });

        const payload =
          response.data?.notifications ||
          response.data?.data ||
          response.data ||
          [];

        if (Array.isArray(payload) && payload.length > 0) {
          applyLocalNotifications(payload);
        } else {
          applyLocalNotifications(studentNotificationsFromProfile);
        }
      } catch (err: any) {
        if (err?.response?.status === 404) {
          applyLocalNotifications(studentNotificationsFromProfile);
        } else {
          console.error('Error fetching notifications:', err);
        }
      } finally {
        setNotificationsLoading(false);
      }
    };

    fetchNotifications();
  }, [studentToken, studentNotificationsFromProfile]);

  const markNotificationAsRead = async (notification: StudentNotification) => {
    if (!notification || notification.isRead) return;

    // Remove notification from local state immediately (since we only show unread ones)
    const updateLocal = () => {
      setNotifications((prev) =>
        prev.filter((item) => {
          const matchesId = notification._id && item._id === notification._id;
          const matchesTimestamp =
            !notification._id &&
            item.sentAt === notification.sentAt &&
            item.message === notification.message;

          // Remove the notification (return false to filter it out)
          return !(matchesId || matchesTimestamp);
        })
      );
    };

    updateLocal();

    if (!studentToken || !notification._id) return;

    try {
      await axios.put(
        `${baseUrl}/api/student/notifications/${notification._id}/read`,
        {},
        {
          headers: {
            Authorization: `Bearer ${studentToken}`
          }
        }
      );
    } catch (err: any) {
      if (err?.response?.status === 404) {
        return;
      }
      console.error('Error marking notification as read:', err);
    }
  };

  const handleNotificationClick = (notification: StudentNotification) => {
    if (!notification) return;
    if (!notification.isRead) {
      markNotificationAsRead(notification);
    }
  };

  const formatNotificationDate = (sentAt: string) => {
    if (!sentAt) return 'Unknown date';
    try {
      return new Date(sentAt).toLocaleString(undefined, {
        dateStyle: 'medium',
        timeStyle: 'short'
      });
    } catch {
      return sentAt;
    }
  };


  // // Add refresh functionality on page focus
  // useEffect(() => {
  //   const handleFocus = () => {
  //     refetchUserData();
  //   };

  //   window.addEventListener('focus', handleFocus);
  //   return () => window.removeEventListener('focus', handleFocus);
  // }, [refetchUserData]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF7500] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading dashboard: {error}</p>
          <button 
            onClick={refetchUserData}
            className="bg-[#FF7500] text-white px-4 py-2 rounded hover:bg-[#E66A00] transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
        {/* Fees Info Popup */}
        {/* {showFeesPopup && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-[1vw] p-[3vw] max-w-[40vw] mx-[5vw] shadow-2xl">
              <div className="text-center">
                <div className="mb-[2vw]">
                  <PaymentsRoundedIcon style={{fontSize: '4vw', color: '#FF7500'}} />
                </div>
                <h3 className="text-h4TextPhone md:text-h4Text font-bold text-gray-800 mb-[1vw]">
                  Fees Information Not Available
                </h3>
                <p className="text-regularTextPhone md:text-regularText text-gray-600 mb-[2vw]">
                  Your fees information hasn't been uploaded yet. Please try again after some time.
                </p>
                <button
                  onClick={() => setShowFeesPopup(false)}
                  className="bg-[#FF7500] text-white px-[3vw] py-[1vw] rounded-[.5vw] font-medium hover:bg-[#E66A00] transition-colors duration-300"
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        )} */}
        
        {/* main dashboard div */}
       {userData &&
       <div className='pt-[15vw] md:pt-[4vw]'> 
       <div>
        </div>
       <div className='mx-[2vw] w-full  md:w-[90vw] md:mx-[5vw] my-[4vw] md:my-[4vw] p-[1vw] md:p-[2vw] flex flex-row gap-[3vw] rounded-[1vw] shadow-2xl '>
          
          {/* Sidebar */}
          <div className='w-[20vw] h-[60vw] rounded-[1vw] shadow-lg flex flex-col  gap-[3vw] items-center' style={{
            background: 'linear-gradient(0deg, #FF7500 0%,#FF7500 80%, #F39D68 100%)'
          }}>
              <div className='mt-[3vw] bg-[#FFD7C3] p-[1.5vw] rounded-[2vw] border-black border-[.5px]'>
              <Image src='/assets/Images/student-dashboard/graduation-cap.png' alt='sidebar-bg' width={100} height={100} />
              </div>
              {/* Navigation List */}
              <div className='flex flex-col gap-[1.5vw] w-full px-[1vw]'>
                {dashboardItems.map((item) => (
                  <div 
                    key={item.id}
                    className={`flex items-center  gap-[.75vw] cursor-pointer hover:opacity-100 px-[2vw] py-[.8vw] rounded-[.5vw] transition-all duration-300 ease-in-out ${
                      activeTab === item.id 
                        ? 'opacity-100 bg-white bg-opacity-20' 
                        : 'opacity-50 hover:bg-white hover:bg-opacity-10'
                    }`}
                    onClick={() => {
                      
                        setActiveTab(item.id);
                      }}
                  >
                    <item.icon style={{fontSize: '1.5vw', color: '#FFFFFF' }} />
                    <p className='text-white text-smallTextPhone md:text-regularText font-medium leading-[120%]'>
                      {item.label}
                    </p>
                  </div>
                ))}
                
                {/* Logout Button */}
                <div className='mt-[2vw] pt-[2vw] '>
                  <div 
                    className='flex items-center gap-[.75vw] cursor-pointer px-[2vw] py-[.8vw] rounded-[.5vw] transition-all duration-300 ease-in-out opacity-50 hover:opacity-100 hover:bg-red-500 hover:bg-opacity-20'
                    onClick={() => {
                      localStorage.removeItem('user');
                      router.push('/login');
                    }}
                  >
                    <LogoutRoundedIcon style={{fontSize: '1.5vw', color: '#FFFFFF' }} />
                    <p className='text-white text-smallTextPhone md:text-regularText font-medium leading-[120%]'>
                      Logout
                    </p>
                  </div>
                </div>
              </div>


          </div>

          {/* Main Content */}
          <div className='w-full h-full'>
            <div className='w-full flex flex-row justify-between items-center mb-[3vw] gap-[1.25vw]'>
              {/* <div className='flex items-center w-[24.6vw] h-[3vw] border-[.5px] shadow-md  gap-[.5vw] rounded-[1.5vw] p-[1vw] '>
                <SearchIcon style={{fontSize: '1.5vw', color: 'rgba(0,0,0,.5)' }} />
                    <input className=' ' placeholder='Search'/>
              </div> */}
              <div className="hidden md:flex relative  items-center justify-center gap-[.75vw] ml-auto">
            <div className='border-orangeChosen border-[2px] rounded-full'>
            <Image src={"/assets/Images/user.png"} alt="user" width={56} height={56} className='w-[2.5vw] h-[2.5vw] rounded-full' />
            </div>
            <h2 className=" text-smallTextPhone leading-[100%] font-bold ">{(userData as any).name.charAt(0).toUpperCase() + (userData as any).name.slice(1)}</h2>
          </div>
          <div className="flex items-center gap-[1vw]">
            <button 
              onClick={refetchUserData}
              className="text-[#FF7500] hover:text-[#E66A00] transition-colors"
              title="Refresh data"
            >
              <svg className="w-[1.5vw] h-[1.5vw]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
            <div className="relative">
              <NotificationsActiveRoundedIcon style={{fontSize: '1.5vw', color: '#000000' }} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[0.6rem] font-semibold rounded-full px-1.5 py-[1px]">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </div>
          </div>
          </div>
          {activeTab === 'dashboard' && (
            <Dashboard
              userData={userData}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              notifications={notifications}
              notificationsLoading={notificationsLoading}
              unreadCount={unreadCount}
              onNotificationClick={handleNotificationClick}
              formatNotificationDate={formatNotificationDate}
            />
          )}
           {activeTab === 'language-courses' && <LanguageCourses activeTab={activeTab} userData={userData} />}
           {activeTab === 'application-status' && <ApplicationStatus userData={userData} />}
           {activeTab === 'documents' && <Documents userData={userData} activeTab={activeTab} />}
           {activeTab === 'chat-support' && <Chat userData={userData} activeTab={activeTab} />}
           {activeTab === 'meetings' && <Meetings userData={userData} activeTab={activeTab} />}
           {activeTab === 'fee-structure' && <Fees userData={userData} activeTab={activeTab}/>}

          </div>
        </div>
        </div>}

    </div>
  )
}

export default StudentDashboard
