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
  const [scheduledMeeting, setScheduledMeeting] = useState<any>(null);
  const [admins, setAdmins] = useState<any[]>([]);
  const [selectedAdmins, setSelectedAdmins] = useState<string[]>([]);
  const [meetingData, setMeetingData] = useState({
      title: '',
      date: '',
      time: '',
      duration: '60',
      description: '',
      agenda: ''
  });
  const [loading, setLoading] = useState(false);

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

  // Fetch all admins for meeting scheduling
  useEffect(() => {
    if (showMeetingModal) {
      fetchAdmins();
    }
  }, [showMeetingModal]);

  const fetchAdmins = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/admin/users`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      
      if (response.data.status === 'success') {
        setAdmins(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching admins:', error);
      alert('Failed to fetch admins');
    }
  };

  const handleMeetingSubmit = async () => {
    if (!selectedAdmins.length) {
      alert('Please select at least one admin');
      return;
    }

    if (!meetingData.title || !meetingData.date || !meetingData.time) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      
      // Format the meeting payload according to backend expectations
      const meetingPayload = {
        title: meetingData.title,
        date: meetingData.date,
        time: meetingData.time,
        duration: parseInt(meetingData.duration),
        description: meetingData.description || '',
        agenda: meetingData.agenda || '',
        attendees: selectedAdmins,
        organizer: adminData?._id,
        meetingType: 'zoom'
      };

      const response = await axios.post(`${baseUrl}/api/admin/schedule-meeting`, meetingPayload, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });

      if (response.data.success) {
        setScheduledMeeting(response.data.meeting);
        setShowMeetingModal(false);
        setShowSuccessModal(true);
        resetMeetingForm();
        
        // Show success message
        console.log('Meeting scheduled successfully:', response.data.message);
      } else {
        alert(response.data.message || 'Failed to schedule meeting');
      }
    } catch (error: any) {
      console.error('Error scheduling meeting:', error);
      const errorMessage = error.response?.data?.message || 'Failed to schedule meeting';
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const resetMeetingForm = () => {
    setSelectedAdmins([]);
    setMeetingData({
      title: '',
      date: '',
      time: '',
      duration: '60',
      description: '',
      agenda: ''
    });
  };

  const handleAdminSelection = (adminId: string) => {
    setSelectedAdmins(prev => 
      prev.includes(adminId) 
        ? prev.filter(id => id !== adminId)
        : [...prev, adminId]
    );
  };

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
    }
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
      <main className="flex-1 space-y-6 overflow-auto bg-[#F4F5F7]" >
        <nav className='border-b-2 items-center border-[#E8E8E8] px-[24px] py-[24px] flex'>
          <h4 className='font-bold text-h5Text'>Hello, {adminData?.firstName}</h4>
          <Image src="/assets/Images/admin/double-chevron-right.svg" width={20} height={20} className='ml-[2vw] w-[1.5vw] h-[1.5vw]' alt='arrow down icon' />
          <BreadcrumbAdmin role={adminData?.role}/>
          <NotificationsIcon className='ml-auto' style={{fontSize: '40px', color: '#666666' }} />
          <CameraIcon 
            className='ml-[16px] cursor-pointer hover:opacity-80 transition-opacity' 
            style={{fontSize: '40px', color: '#666666' }}
            onClick={() => setShowMeetingModal(true)}
          />
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
        {showMeetingModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex  min-h-full items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-[600px] max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Schedule Zoom Meeting</h3>
                <button
                  onClick={() => setShowMeetingModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-6">
                {/* Meeting Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meeting Title *
                  </label>
                  <input
                    type="text"
                    value={meetingData.title}
                    onChange={(e) => setMeetingData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="Enter meeting title"
                  />
                </div>

                {/* Date and Time */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date *
                    </label>
                    <input
                      type="date"
                      value={meetingData.date}
                      onChange={(e) => setMeetingData(prev => ({ ...prev, date: e.target.value }))}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Time *
                    </label>
                    <input
                      type="time"
                      value={meetingData.time}
                      onChange={(e) => setMeetingData(prev => ({ ...prev, time: e.target.value }))}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Duration */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration (minutes)
                  </label>
                  <select
                    value={meetingData.duration}
                    onChange={(e) => setMeetingData(prev => ({ ...prev, duration: e.target.value }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  >
                    <option value="30">30 minutes</option>
                    <option value="60">1 hour</option>
                    <option value="90">1.5 hours</option>
                    <option value="120">2 hours</option>
                  </select>
                </div>

                {/* Agenda */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Agenda
                  </label>
                  <textarea
                    value={meetingData.agenda}
                    onChange={(e) => setMeetingData(prev => ({ ...prev, agenda: e.target.value }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    rows={4}
                    placeholder="Detailed agenda and discussion points"
                  />
                </div>

                {/* Admin Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Attendees *
                  </label>
                  <div className="max-h-40 overflow-y-auto border border-gray-300 rounded-md p-3">
                    {admins.length > 0 ? (
                      admins.map((admin) => (
                        <label key={admin._id} className="flex items-center space-x-3 py-2 hover:bg-gray-50 px-2 rounded">
                          <input
                            type="checkbox"
                            checked={selectedAdmins.includes(admin._id)}
                            onChange={() => handleAdminSelection(admin._id)}
                            className="w-4 h-4 text-teal-600 bg-gray-100 border-gray-300 rounded focus:ring-teal-500 focus:ring-2"
                          />
                          <span className="text-sm text-gray-700">
                            {admin.firstName && admin.lastName 
                              ? `${admin.firstName} ${admin.lastName}` 
                              : admin.username || admin.email
                            }
                            {admin.role && (
                              <span className="text-gray-500 ml-2">({admin.role})</span>
                            )}
                          </span>
                        </label>
                      ))
                    ) : (
                      <p className="text-gray-500 text-sm">Loading admins...</p>
                    )}
                  </div>
                  {selectedAdmins.length > 0 && (
                    <p className="text-sm text-gray-600 mt-2">
                      {selectedAdmins.length} admin(s) selected
                    </p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 mt-8">
                <button
                  onClick={() => setShowMeetingModal(false)}
                  className="px-6 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleMeetingSubmit}
                  disabled={loading || !selectedAdmins.length}
                  className="px-6 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? 'Scheduling...' : 'Schedule Meeting'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Meeting Success Modal */}
        {showSuccessModal && scheduledMeeting && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900">Meeting Scheduled Successfully! 🎉</h2>
                <button
                  onClick={() => setShowSuccessModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                {/* Meeting Details */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-lg mb-2">{scheduledMeeting.title}</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Date:</span> {scheduledMeeting.date}
                    </div>
                    <div>
                      <span className="font-medium">Time:</span> {scheduledMeeting.time}
                    </div>
                    <div>
                      <span className="font-medium">Duration:</span> {scheduledMeeting.duration} minutes
                    </div>
                    <div>
                      <span className="font-medium">Type:</span> {scheduledMeeting.meetingType}
                    </div>
                  </div>
                </div>

                {/* Zoom Meeting Details */}
                {scheduledMeeting.zoomJoinUrl && (
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-blue-900 mb-2">🎥 Zoom Meeting Details</h4>
                    <div className="space-y-2">
                      <div>
                        <span className="font-medium text-blue-900">Join URL:</span>
                        <a 
                          href={scheduledMeeting.zoomJoinUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 underline ml-2 break-all"
                        >
                          {scheduledMeeting.zoomJoinUrl}
                        </a>
                      </div>
                      {scheduledMeeting.zoomPassword && (
                        <div>
                          <span className="font-medium text-blue-900">Password:</span>
                          <span className="ml-2 font-mono bg-blue-100 px-2 py-1 rounded text-blue-800">
                            {scheduledMeeting.zoomPassword}
                          </span>
                        </div>
                      )}
                      {scheduledMeeting.zoomStartUrl && (
                        <div>
                          <span className="font-medium text-blue-900">Host Start URL:</span>
                          <a 
                            href={scheduledMeeting.zoomStartUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 underline ml-2 break-all"
                          >
                            {scheduledMeeting.zoomStartUrl}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Meeting Description and Agenda */}
                {scheduledMeeting.description && (
                  <div>
                    <span className="font-medium">Description:</span>
                    <p className="text-gray-700 mt-1">{scheduledMeeting.description}</p>
                  </div>
                )}

                {scheduledMeeting.agenda && (
                  <div>
                    <span className="font-medium">Agenda:</span>
                    <p className="text-gray-700 mt-1">{scheduledMeeting.agenda}</p>
                  </div>
                )}

                {/* WhatsApp Notification Status */}
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <div className="flex items-center space-x-2">
                    <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <h4 className="font-semibold text-green-900">WhatsApp Notifications Sent</h4>
                  </div>
                  <p className="text-green-800 text-sm mt-2">
                    ✅ Meeting has been scheduled and all attendees have been notified via WhatsApp. 
                    The Zoom meeting link is now available for all participants.
                  </p>
                  <p className="text-green-700 text-xs mt-1">
                    📱 Check your WhatsApp for meeting details and join link.
                  </p>
                </div>

                {/* Attendees List */}
                {scheduledMeeting.attendees && scheduledMeeting.attendees.length > 0 && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">👥 Attendees ({scheduledMeeting.attendees.length})</h4>
                    <div className="space-y-1">
                      {scheduledMeeting.attendees.map((attendee: any, index: number) => (
                        <div key={index} className="text-sm text-gray-700">
                          • {attendee.firstName && attendee.lastName 
                            ? `${attendee.firstName} ${attendee.lastName}` 
                            : attendee.username || attendee.email
                          }
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end mt-6">
                <button
                  onClick={() => setShowSuccessModal(false)}
                  className="px-6 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminLayout; 