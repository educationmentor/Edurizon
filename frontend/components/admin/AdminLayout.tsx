import React, { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';
import axios from 'axios';
import { baseUrl } from '@/lib/baseUrl';
import { clearAdminAuth, getAdminData, getAdminToken } from '@/utils/adminStorage';
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

interface AdminTask {
  _id: string;
  messageDetail: string;
  taskType?: 'Task' | 'Update';
  deadline: string;
  assignedBy?: {
    name?: string;
    email?: string;
    firstName?: string;
    lastName?: string;
  };
  assignedTo: {
    adminId: string;
    isRead: boolean;
    isDeleted: boolean;
  }[];
  replies?: {
    senderId?: {
      name?: string;
      email?: string;
      firstName?: string;
      lastName?: string;
      role?: string;
    };
    replyMessage: string;
    timestamp: string;
  }[];
  senderHasNewReply?: boolean;
  status: 'Pending' | 'Completed' | 'Overdue';
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
  const [tasks, setTasks] = useState<AdminTask[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificationsLoading, setNotificationsLoading] = useState(false);
  const [replyingTaskId, setReplyingTaskId] = useState<string | null>(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [notificationsError, setNotificationsError] = useState<string | null>(null);
  const [urgentGeneralTasks, setUrgentGeneralTasks] = useState<AdminTask[]>([]);
  const [showUrgentModal, setShowUrgentModal] = useState(false);
  const [activeNotificationTab, setActiveNotificationTab] = useState<'Task' | 'Update'>('Task');

  useEffect(() => {
    const storedAdmin = getAdminData();
    if (storedAdmin) {
      setAdminData(storedAdmin);
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
      clearAdminAuth();
      return false;
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      // Check for admin token
      const token = getAdminToken();
      const storedAdminData = getAdminData();

      if (!token || !storedAdminData) {
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
      const { role } = storedAdminData;
      setUserRole(role);
    };

    checkAuth();
  }, [router]);

  const calculateUnreadCount = (taskList: AdminTask[], adminId?: string) => {
    if (!adminId) return 0;
    let count = 0;
    taskList.forEach((task) => {
      const entry = task.assignedTo.find((a) => a.adminId === adminId);
      if (entry && !entry.isDeleted && !entry.isRead) {
        count += 1;
      }
    });
    return count;
  };

  const isDeadlineImminent = (deadline?: string) => {
    if (!deadline) return false;
    const deadlineDate = new Date(deadline);
    const now = new Date();
    const diff = deadlineDate.getTime() - now.getTime();
    // Future and within next 24 hours
    return diff > 0 && diff <= 24 * 60 * 60 * 1000;
  };

  const computeUrgentGeneralTasks = (taskList: AdminTask[], adminId?: string) => {
    if (!adminId) return [];
    return taskList.filter((task) => {
      const type = task.taskType || 'Task';
      if (type !== 'Task') return false;
      if (!task.deadline) return false;

      const entry = task.assignedTo.find(
        (a) => a.adminId === adminId && !a.isDeleted && !a.isRead
      );
      if (!entry) return false;

      return isDeadlineImminent(task.deadline);
    });
  };

  const fetchTasks = async () => {
    try {
      setNotificationsLoading(true);
      setNotificationsError(null);
      const token = getAdminToken();
      if (!token) return;
      const authToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;

      const isSuperAdmin = adminData?.role === 'super-admin';
      const adminId = adminData?._id;

      if (isSuperAdmin) {
        // Super admin: show only
        // - tasks assigned to them
        // - tasks they created that have new replies
        const [sentRes, meRes] = await Promise.all([
          axios.get<AdminTask[]>(`${baseUrl}/api/admin/tasks/sent`, {
            headers: { Authorization: authToken },
          }),
          axios.get<AdminTask[]>(`${baseUrl}/api/admin/tasks/me`, {
            headers: { Authorization: authToken },
          }),
        ]);

        const sentTasks = sentRes.data || [];
        const myTasks = meRes.data || [];

        const combinedMap = new Map<string, AdminTask>();

        // Tasks assigned to the super admin
        myTasks.forEach((task) => {
          combinedMap.set(task._id, task);
        });

        // Sent tasks that have new replies
        sentTasks
          .filter((task) => task.senderHasNewReply)
          .forEach((task) => {
            combinedMap.set(task._id, task);
          });

        const combined = Array.from(combinedMap.values());
        setTasks(combined);
        setUnreadCount(combined.filter((t) => isTaskUnread(t)).length);

        // Urgent tasks should only consider tasks assigned to this super admin (myTasks)
        const urgent = computeUrgentGeneralTasks(myTasks, adminId);
        setUrgentGeneralTasks(urgent);
        setShowUrgentModal(urgent.length > 0);
      } else {
        const res = await axios.get(`${baseUrl}/api/admin/tasks/me`, {
          headers: {
            Authorization: authToken,
          },
        });

        const data: AdminTask[] = res.data || [];
        setTasks(data);
        const adminId = adminData?._id;
        setUnreadCount(calculateUnreadCount(data, adminId));

        const urgent = computeUrgentGeneralTasks(data, adminId);
        setUrgentGeneralTasks(urgent);
        setShowUrgentModal(urgent.length > 0);
      }
    } catch (error: any) {
      console.error('Failed to fetch tasks:', error);
      setNotificationsError(error?.response?.data?.message || 'Failed to load notifications.');
    } finally {
      setNotificationsLoading(false);
    }
  };

  useEffect(() => {
    // fetch tasks once admin data is available
    if (adminData?._id) {
      fetchTasks();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [adminData?._id]);

  const handleToggleNotifications = () => {
    setShowNotifications((prev) => !prev);
    if (!showNotifications && tasks.length === 0) {
      fetchTasks();
    }
  };

  const handleMarkAsRead = async (taskId: string) => {
    if (adminData?.role === 'super-admin') return;
    try {
      const token = getAdminToken();
      if (!token) return;
      const authToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
      await axios.patch(`${baseUrl}/api/admin/tasks/read/${taskId}`, {}, {
        headers: { Authorization: authToken },
      });
      // Optimistically update local state: remove the task from notification list
      setTasks((prev) => {
        const updated = prev.filter((t) => t._id !== taskId);
        const adminId = adminData?._id;
        if (adminData?.role === 'super-admin') {
          setUnreadCount(updated.filter((t) => isTaskUnread(t)).length);
        } else {
          setUnreadCount(calculateUnreadCount(updated, adminId));
        }
        // Also remove from urgent tasks, if present
        setUrgentGeneralTasks((prevUrgent) =>
          prevUrgent.filter((t) => t._id !== taskId)
        );
        return updated;
      });
    } catch (error) {
      console.error('Failed to mark task as read:', error);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      const token = getAdminToken();
      if (!token) return;
      const authToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
      await axios.patch(`${baseUrl}/api/admin/tasks/delete/${taskId}`, {}, {
        headers: { Authorization: authToken },
      });
      fetchTasks();
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  const handleOpenReply = (taskId: string) => {
    setReplyingTaskId(taskId);
    setReplyMessage('');
  };

  const handleCloseReply = () => {
    setReplyingTaskId(null);
    setReplyMessage('');
  };

  const handleSubmitReply = async () => {
    if (!replyingTaskId || !replyMessage.trim()) return;
    try {
      const token = getAdminToken();
      if (!token) return;
      const authToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
      await axios.post(
        `${baseUrl}/api/admin/tasks/reply/${replyingTaskId}`,
        { replyMessage },
        {
          headers: { Authorization: authToken },
        }
      );
      handleCloseReply();
      fetchTasks();
    } catch (error) {
      console.error('Failed to submit reply:', error);
    }
  };

  const getMessageSnippet = (message: string) => {
    if (!message) return '';
    return message.length > 70 ? `${message.slice(0, 67)}...` : message;
  };

  const getAssignedByName = (task: AdminTask) => {
    const a = task.assignedBy;
    if (!a) return 'Super Admin';
    if (a.firstName || a.lastName) {
      return `${a.firstName || ''} ${a.lastName || ''}`.trim();
    }
    if (a.name) return a.name;
    return a.email || 'Super Admin';
  };

  const isTaskUnread = (task: AdminTask) => {
    const adminId = adminData?._id;
    const fromReplies = !!task.senderHasNewReply && adminData?.role === 'super-admin';

    if (!adminId) return fromReplies;

    const entry = task.assignedTo.find((a) => a.adminId === adminId);
    const asRecipient = !!(entry && !entry.isDeleted && !entry.isRead);

    return fromReplies || asRecipient;
  };

  const getReplyAuthorName = (task: AdminTask) => {
    if (!task.replies || task.replies.length === 0) return '';
    const latest = task.replies[task.replies.length - 1];
    const sender = latest?.senderId;
    if (!sender) return '';
    if (sender.firstName || sender.lastName) {
      return `${sender.firstName || ''} ${sender.lastName || ''}`.trim();
    }
    if (sender.name) return sender.name;
    return sender.email || '';
  };

  const getLatestReplySnippet = (task: AdminTask) => {
    if (!task.replies || task.replies.length === 0) return '';
    const latest = task.replies[task.replies.length - 1];
    const message = latest?.replyMessage || '';
    if (!message) return '';
    return message.length > 70 ? `${message.slice(0, 67)}...` : message;
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

  const handleLogout = async () => {
    try {
      // Record logout in attendance
      const token = getAdminToken();
      if (token) {
        const authToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
        await axios.post(`${baseUrl}/api/attendance/logout`, {}, {
          headers: {
            Authorization: authToken,
          },
        });
      }
    } catch (error) {
      console.error('Failed to record logout:', error);
      // Continue with logout even if attendance recording fails
    }

    clearAdminAuth();
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
          
          {/* Notifications */}
          <div className="relative ml-auto mr-3">
            <button
              type="button"
              onClick={handleToggleNotifications}
              className="relative focus:outline-none"
            >
              <NotificationsIcon style={{ fontSize: '32px', color: '#666666' }} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-red-500 text-white">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                <div className="px-4 py-2 border-b flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-800">Tasks & Updates</span>
                  {notificationsLoading && (
                    <span className="text-[10px] text-gray-400">Loading...</span>
                  )}
                </div>
                {notificationsError && (
                  <div className="px-4 py-2 text-xs text-red-600 bg-red-50">
                    {notificationsError}
                  </div>
                )}
                <div className="max-h-80 overflow-y-auto">
                  {/* Tabs for Tasks vs Updates */}
                  <div className="px-4 pt-3 pb-2 flex items-center gap-2 border-b border-gray-100">
                    <button
                      type="button"
                      onClick={() => setActiveNotificationTab('Task')}
                      className={`text-xs font-semibold px-3 py-1 rounded-full ${
                        activeNotificationTab === 'Task'
                          ? 'bg-teal-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Tasks
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveNotificationTab('Update')}
                      className={`text-xs font-semibold px-3 py-1 rounded-full ${
                        activeNotificationTab === 'Update'
                          ? 'bg-teal-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Updates
                    </button>
                  </div>

                  {tasks.length === 0 && !notificationsLoading ? (
                    <div className="px-4 py-4 text-sm text-gray-500">
                      No tasks or updates assigned to you.
                    </div>
                  ) : (
                    tasks
                      .filter((task) =>
                        (task.taskType || 'Task') === activeNotificationTab
                      )
                      .map((task) => (
                          <div
                            key={task._id}
                            className={`px-4 py-3 border-b last:border-b-0 ${
                              isTaskUnread(task) ? 'bg-teal-50' : 'bg-white'
                            }`}
                          >
                            <div>
                              {adminData?.role === 'super-admin' ? (
                                <p className="text-xs text-gray-500">
                                  {task.senderHasNewReply
                                    ? (
                                      <>
                                        New Reply from{' '}
                                        <span className="font-semibold text-gray-700">
                                          {getReplyAuthorName(task) || 'Unknown'}
                                        </span>
                                        :{' '}
                                        <span className="font-semibold text-gray-700">
                                          {getLatestReplySnippet(task) || getMessageSnippet(task.messageDetail)}
                                        </span>
                                      </>
                                    )
                                    : (
                                      <>
                                        Task "{getMessageSnippet(task.messageDetail)}"
                                      </>
                                    )}
                                </p>
                              ) : (
                                <p className="text-xs text-gray-500">
                                  Task from{' '}
                                  <span className="font-semibold text-gray-700">
                                    {getAssignedByName(task)}
                                  </span>
                                </p>
                              )}
                              <p
                                className={`mt-1 text-sm ${
                                  isTaskUnread(task) ? 'font-semibold text-gray-900' : 'text-gray-800'
                                }`}
                              >
                                {getMessageSnippet(task.messageDetail)}
                              </p>
                              <p className="mt-1 text-xs text-gray-500">
                                Deadline:{' '}
                                {task.deadline
                                  ? new Date(task.deadline).toLocaleDateString()
                                  : 'N/A'}
                              </p>
                            </div>
                            <div className="mt-2 flex items-center justify-end gap-2">
                              {adminData?.role !== 'super-admin' && isTaskUnread(task) && (
                                <button
                                  onClick={() => handleMarkAsRead(task._id)}
                                  className="text-[11px] text-teal-700 hover:text-teal-900"
                                >
                                  {(task.taskType || 'Task') === 'Task'
                                    ? 'Done'
                                    : 'Mark as read'}
                                </button>
                              )}
                              <button
                                onClick={() => handleOpenReply(task._id)}
                                className="text-[11px] text-blue-600 hover:text-blue-800"
                              >
                                Reply
                              </button>
                              <button
                                onClick={() => handleDeleteTask(task._id)}
                                className="text-[11px] text-red-500 hover:text-red-700"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          <div 
            className="relative meeting-dropdown-container ml-[12px]  group"
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

        {/* Urgent general tasks (Tasks due within 24 hours and unread) */}
        {showUrgentModal && urgentGeneralTasks.length > 0 && (
          <div className="fixed bottom-4 right-4 z-40 max-w-md w-full">
            <div className="bg-white shadow-lg rounded-lg border border-yellow-300">
              <div className="px-4 py-3 border-b border-yellow-200 flex items-center justify-between bg-yellow-50 rounded-t-lg">
                <div>
                  <p className="text-sm font-semibold text-yellow-800">
                    Urgent Tasks Due Soon
                  </p>
                  <p className="text-xs text-yellow-700">
                    You have tasks due within the next 24 hours.
                  </p>
                </div>
                <button
                  onClick={() => setShowUrgentModal(false)}
                  className="text-yellow-700 hover:text-yellow-900 text-sm font-semibold"
                  type="button"
                >
                  ✕
                </button>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {urgentGeneralTasks.map((task) => (
                  <div key={task._id} className="px-4 py-3 border-b last:border-b-0 border-yellow-100">
                    <p className="text-sm font-semibold text-gray-900">
                      {getMessageSnippet(task.messageDetail)}
                    </p>
                    <p className="mt-1 text-xs text-gray-600">
                      Assigned by:{' '}
                      <span className="font-medium text-gray-800">
                        {getAssignedByName(task)}
                      </span>
                    </p>
                    <p className="mt-1 text-xs text-gray-600">
                      Deadline:{' '}
                      <span className="font-medium text-gray-800">
                        {task.deadline
                          ? new Date(task.deadline).toLocaleString()
                          : 'N/A'}
                      </span>
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

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

        {/* Reply Modal */}
        {replyingTaskId && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
              <div className="px-4 py-3 border-b flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-900">Reply to Task / Update</h3>
                <button
                  onClick={handleCloseReply}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              <div className="p-4 space-y-3">
                <textarea
                  rows={4}
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500"
                  placeholder="Type your reply here..."
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={handleCloseReply}
                    className="px-3 py-1.5 text-xs rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmitReply}
                    className="px-3 py-1.5 text-xs rounded-md bg-teal-600 text-white hover:bg-teal-700 disabled:opacity-60"
                    disabled={!replyMessage.trim()}
                  >
                    Send Reply
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

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