import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import Link from 'next/link';
import Image from 'next/image';
import axios from 'axios';
import { baseUrl } from '@/lib/baseUrl';
import {
  UsersIcon,
  DocumentTextIcon,
  CurrencyRupeeIcon,
  ChartBarIcon,
  VideoCameraIcon,
} from '@heroicons/react/24/outline';
import AddMemberDialog from '@/components/admin/AddMemberDialog';
import { TransitionLink } from '@/utils/TransitionLink';
import BreadcrumbAdmin from '@/components/BreadcumbAdmin';

interface AdminUser {
  _id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  country: string[];
  contactNo: string;
  joiningDate: string;
  active: boolean;
}

interface Meeting {
  _id: string;
  title: string;
  dateTime: string;
  duration: number;
  meetLink: string;
  organizer: {
    firstName: string;
    lastName: string;
    email: string;
  };
  participants: Array<{
    firstName: string;
    lastName: string;
    email: string;
  }>;
  status: 'scheduled' | 'completed' | 'cancelled';
}

const ITEMS_PER_PAGE = 5; // Number of items to show per page

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('Counseling');
  const [currentPage, setCurrentPage] = useState(1);
  const [teamMembers, setTeamMembers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filteredMembers, setFilteredMembers] = useState<AdminUser[]>([]);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loadingMeetings, setLoadingMeetings] = useState(true);
  const [meetingError, setMeetingError] = useState('');
  const [isAddMemberDialogOpen, setIsAddMemberDialogOpen] = useState(false);
  const [pendingLeadsCount, setPendingLeadsCount] = useState(0);

  const tabs = ['Counseling', 'Finance', 'Digital','Document Management', 'Super Admin'];

  useEffect(() => {
    fetchTeamMembers();
    fetchMeetings();
    fetchPendingLeadsCount();
  }, []);

  useEffect(() => {
    filterMembers();
  }, [activeTab, teamMembers]);

  const fetchTeamMembers = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.get(`${baseUrl}/api/admin/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.status === 'success') {
        setTeamMembers(response.data.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch team members');
    } finally {
      setLoading(false);
    }
  };

  const fetchMeetings = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.get(`${baseUrl}/api/admin/meetings`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.status === 'success') {
        setMeetings(response.data.data);
      }
    } catch (err: any) {
      setMeetingError(err.response?.data?.message || 'Failed to fetch meetings');
    } finally {
      setLoadingMeetings(false);
    }
  };

  const fetchPendingLeadsCount = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) return;

      const authToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
      const response = await axios.get(`${baseUrl}/api/admin/consultation/pending`, {
        headers: { 
          Authorization: authToken
        }
      });

      if (response.data.success) {
        setPendingLeadsCount(response.data.data.length);
      }
    } catch (err) {
      console.error('Failed to fetch pending leads count:', err);
    }
  };

  const filterMembers = () => {
    if (!teamMembers) return;

    let filtered = teamMembers;
    
    // Filter based on active tab
    switch (activeTab.toLowerCase()) {
      case 'super admin':
        filtered = teamMembers.filter(member => member.role === 'super-admin');
        break;
      case 'counseling':
        filtered = teamMembers.filter(member => member.role === 'counsellor');
        break;
      case 'finance':
        filtered = teamMembers.filter(member => member.role === 'finance');
        break;
      case 'digital':
        filtered = teamMembers.filter(member => member.role === 'digitalMarketing');
        break;
      case 'document management':
        filtered = teamMembers.filter(member => member.role === 'documentHandler');
        break;
      default:
        filtered = teamMembers;
    }

    setFilteredMembers(filtered);
  };

  const toggleAccess = async (userId: string, currentStatus: boolean) => {
    try {
      const token = localStorage.getItem('adminToken');
      await axios.patch(
        `${baseUrl}/api/admin/users/${userId}/toggle-access`,
        { active: !currentStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update local state
      setTeamMembers(prev =>
        prev.map(member =>
          member._id === userId ? { ...member, active: !currentStatus } : member
        )
      );
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to toggle access');
    }
  };

  const removeMember = async (userId: string) => {
    if (!window.confirm('Are you sure you want to remove this team member?')) return;

    try {
      const token = localStorage.getItem('adminToken');
      await axios.delete(`${baseUrl}/api/admin/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Update local state
      setTeamMembers(prev => prev.filter(member => member._id !== userId));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to remove team member');
    }
  };

  // Calculate pagination values
  const totalItems = filteredMembers.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentItems = filteredMembers.slice(startIndex, endIndex);

  // Handle page change
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  // Generate page numbers array
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5; // Maximum number of visible page buttons
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    // Adjust start page if we're near the end
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return pageNumbers;
  };

  // Reset to first page when tab changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  return (
    <AdminLayout>
      <div className="py-6">
        <div className="px-4 sm:px-6 md:px-8">
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
          <BreadcrumbAdmin/>

        </div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
          

          {/* Upcoming Meetings
          <div className="mt-8">
            <div className="bg-white rounded-lg shadow">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Upcoming Meetings</h2>
                  <Link href="/admin/superadmin/schedule-call">
                    <button className="bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700 flex items-center">
                      <VideoCameraIcon className="h-5 w-5 mr-2" />
                      Schedule Team Call
                    </button>
                  </Link>
                </div>

                {meetingError && (
                  <div className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded-md">
                    {meetingError}
                  </div>
                )}

                {loadingMeetings ? (
                  <div className="flex justify-center items-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
                  </div>
                ) : meetings.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Title
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date & Time
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Duration
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Organizer
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {meetings.map((meeting) => (
                          <tr key={meeting._id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {meeting.title}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(meeting.dateTime).toLocaleString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {meeting.duration} minutes
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {`${meeting.organizer.firstName} ${meeting.organizer.lastName}`}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <a
                                href={meeting.meetLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-teal-600 hover:text-teal-900 mr-4"
                              >
                                Join Meeting
                              </a>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No upcoming meetings scheduled
                  </div>
                )}
              </div>
            </div>
          </div> */}

          {/* Team Section */}
          <div className="mt-8">
            <div className="bg-white rounded-lg shadow">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Team</h2>
                  <div className="flex gap-4">
                    <button className="bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700">
                      Team Call
                    </button>
                    <TransitionLink href="/admin/superadmin/leads" >
                      <button className="relative bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700">
                        View Leads
                        {pendingLeadsCount > 0 && (
                          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                            {pendingLeadsCount}
                          </span>
                        )}
                      </button>
                    </TransitionLink>
                   
                    <button
                      onClick={() => setIsAddMemberDialogOpen(true)}
                      className="bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700 flex items-center"
                    >
                      <span className="mr-2">+</span>
                      Add Member
                    </button>
                  </div>
                </div>

                {/* Team Tabs */}
                <div className="mb-6">
                  <div className="border-b border-gray-200">
                    <nav className="-mb-px flex space-x-8">
                      {tabs.map((tab) => (
                        <button
                          key={tab}
                          onClick={() => setActiveTab(tab)}
                          className={`${
                            activeTab === tab
                              ? 'border-teal-500 text-teal-600'
                              : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                          } whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium`}
                        >
                          {tab}
                        </button>
                      ))}
                    </nav>
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded-md">
                    {error}
                  </div>
                )}

                {/* Team Table */}
                <div className="overflow-x-auto">
                  {loading ? (
                    <div className="flex justify-center items-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
                    </div>
                  ) : (
                    <table className="min-w-full">
                      <thead className="bg-teal-600 text-white">
                        <tr>
                          <th className="px-6 py-3 text-left text-sm font-semibold">Member name</th>
                          {activeTab === 'Counseling' && <th className="px-6 py-3 text-left text-sm font-semibold">Country</th>}
                          <th className="px-6 py-3 text-left text-sm font-semibold">Contact No.</th>
                          <th className="px-6 py-3 text-left text-sm font-semibold">Joining Date</th>
                          <th className="px-6 py-3 text-left text-sm font-semibold">Login-Access</th>
                          <th className="px-6 py-3 text-left text-sm font-semibold">Remove</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {currentItems.map((member) => (
                          <tr key={member._id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">
                                    {member.firstName} {member.lastName}
                                  </div>
                                  <div className="text-sm text-gray-500">{member.email}</div>
                                </div>
                              </div>
                            </td>
                            {activeTab === 'Counseling' && (
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {member.country.join(', ')}
                              </td>
                            )}
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {member.contactNo}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(member.joiningDate).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <button
                                onClick={() => toggleAccess(member._id, member.active)}
                                className={`px-3 py-1 rounded-full text-sm ${
                                  member.active
                                    ? 'bg-blue-100 text-blue-800'
                                    : 'bg-gray-100 text-gray-800'
                                }`}
                              >
                                {member.active ? 'Access' : 'No Access'}
                              </button>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <button
                                onClick={() => removeMember(member._id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-end mt-4 gap-2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`p-2 rounded-md ${
                        currentPage === 1
                          ? 'text-gray-400 cursor-not-allowed'
                          : 'hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>

                    {getPageNumbers().map((pageNumber) => (
                      <button
                        key={pageNumber}
                        onClick={() => handlePageChange(pageNumber)}
                        className={`px-3 py-1 rounded-md ${
                          currentPage === pageNumber
                            ? 'bg-teal-600 text-white'
                            : 'hover:bg-gray-100 text-gray-700'
                        }`}
                      >
                        {pageNumber}
                      </button>
                    ))}

                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className={`p-2 rounded-md ${
                        currentPage === totalPages
                          ? 'text-gray-400 cursor-not-allowed'
                          : 'hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>

                    <span className="ml-4 text-sm text-gray-600">
                      Page {currentPage} of {totalPages}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Member Dialog */}
      <AddMemberDialog
        isOpen={isAddMemberDialogOpen}
        onClose={() => setIsAddMemberDialogOpen(false)}
        onSuccess={() => {
          fetchTeamMembers();
        }}
      />
    </AdminLayout>
  );
};

export default AdminDashboard; 