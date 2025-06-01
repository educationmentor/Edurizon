import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import axios from 'axios';
import { baseUrl } from '@/lib/baseUrl';
import { PencilIcon, TrashIcon, ShareIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import toast, { Toaster } from 'react-hot-toast';
import BreadcrumbAdmin from '@/components/BreadcumbAdmin';

interface Counselor {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
}
interface Admin {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

interface Lead {
  assignedTo: any;
  _id: string;
  name: string;
  email: string;
  phone: string;
  interestedCountry: string;
  status: 'pending' | 'accepted' | 'scheduled' | 'completed';
  acceptedBy?: {
    _id: string;
    name: string;
    email: string;
  };
  meetingTime?: string;
  googleMeetLink?: string;
  createdAt: string;
}

const ITEMS_PER_PAGE = 10;

const ViewLeads = () => {
  const [pendingLeads, setPendingLeads] = useState<Lead[]>([]);
  const [acceptedLeads, setAcceptedLeads] = useState<Lead[]>([]);
  const [activeTab, setActiveTab] = useState<'pending' | 'accepted'>('pending');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [counselors, setCounselors] = useState<Counselor[]>([]);
  const [counselorsName, setCounselorsName] = useState<{ [id: string]: string }>({});

  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState<{ isOpen: boolean; leadId: string | null }>({
    isOpen: false,
    leadId: null
  });

  useEffect(() => {
    fetchCounselors();
    fetchLeads();
  }, []);

  const fetchCounselors = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) return;

      const authToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
      const response = await axios.get(`${baseUrl}/api/admin/users?role=counsellor`, {
        headers: { 
          Authorization: authToken
        }
      });

      if (response.data.status === 'success') {
        setCounselors(response.data.data);
        mapCounselorName(counselors);
      }
    } catch (err) {
      console.error('Failed to fetch counselors:', err);
    }
  };

  const fetchLeads = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        setError('Not authenticated. Please log in again.');
        return;
      }

      // Ensure token has Bearer prefix
      const authToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
      
      const [pendingRes, acceptedRes] = await Promise.all([
        axios.get(`${baseUrl}/api/admin/consultation/pending`, {
          headers: { 
            Authorization: authToken
          }
        }),
        axios.get(`${baseUrl}/api/admin/consultation/accepted`, {
          headers: { 
            Authorization: authToken
          }
        })
      ]);
      
      if (pendingRes.data.success) {
        setPendingLeads(pendingRes.data.data);
      }

      if (acceptedRes.data.success) {
        setAcceptedLeads(acceptedRes.data.data);
      }
    } catch (err: any) {
      if (err.response?.status === 401) {
        setError('Session expired. Please log in again.');
        // Redirect to login page
        window.location.href = '/admin';
      } else {
        setError(err.response?.data?.message || 'Failed to fetch leads');
      }
    } finally {
      setLoading(false);
    }
  };

  // Get current leads based on active tab
  const currentLeads = activeTab === 'pending' ? pendingLeads : acceptedLeads;

  // Pagination logic
  const totalItems = currentLeads.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentItems = currentLeads.slice(startIndex, endIndex);


  // Reset page when changing tabs
  useEffect(() => {
    setCurrentPage(1);
    setSelectedLeads([]);
  }, [activeTab]);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return pageNumbers;
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedLeads(currentItems.map(lead => lead._id));
    } else {
      setSelectedLeads([]);
    }
  };

  const handleSelectLead = (leadId: string) => {
    setSelectedLeads(prev => {
      if (prev.includes(leadId)) {
        return prev.filter(id => id !== leadId);
      } else {
        return [...prev, leadId];
      }
    });
  };

  const assignCounsellor = async (leadId: string, counselorId: string,counselorName:string) => {

    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        setError('Not authenticated. Please log in again.');
        return;
      }

      const authToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
      
      const response = await axios.put(
        `${baseUrl}/api/admin/consultation/accept/${leadId}`,
        { counselorId, },
        {
          headers: { 
            Authorization: authToken
          }
        }
      );

      if (response.data.success) {
        // Close the dropdown
        setOpenDropdownId(null);
        // Refresh the leads data
        fetchLeads();
      }
    } catch (err: any) {
      if (err.response?.status === 401) {
        setError('Session expired. Please log in again.');
        window.location.href = '/admin';
      } else {
        setError(err.response?.data?.message || 'Failed to assign counsellor');
      }
    }
  };
  
  const handleDeleteClick = (leadId: string) => {
    setDeleteConfirmation({
      isOpen: true,
      leadId
    });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirmation.leadId) return;

    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        setError('Not authenticated. Please log in again.');
        return;
      }
      const authToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;

      const response = await axios.delete(`${baseUrl}/api/admin/consultation/delete/${deleteConfirmation.leadId}`, {
        headers: {
          Authorization: authToken
        }
      });

      if (response.data.success) {
        toast.success('Lead deleted successfully', {
          duration: 3000,
          position: 'top-right',
          style: {
            background: '#10B981',
            color: '#fff',
            padding: '16px',
          },
        });
        fetchLeads();
      }
    } catch (err: any) {
      if (err.response?.status === 401) {
        setError('Session expired. Please log in again.');
        window.location.href = '/admin';  
      } else {
        toast.error(err.response?.data?.message || 'Failed to delete lead', {
          duration: 3000,
          position: 'top-right',
          style: {
            background: '#EF4444',
            color: '#fff',
            padding: '16px',
          },
        });
      }
    } finally {
      setDeleteConfirmation({ isOpen: false, leadId: null });
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmation({ isOpen: false, leadId: null });
  };

  const mapCounselorName = (counselors: Counselor[]) => {
    counselors.forEach(counselor => {
      setCounselorsName(prev => ({
        ...prev,
        [counselor._id]: counselor.firstName + " " + counselor.lastName,
      }));
    });

  };

  const handleShareOnWhatsApp = (lead: Lead) => {
    // Format the message with lead details
    const message = `
*Lead Details*
Name: ${lead.name}
Email: ${lead.email}
Phone: ${lead.phone}
Interested Country: ${lead.interestedCountry}
Status: ${lead.status}
Assigned To: ${lead.assignedTo ? counselorsName[lead.assignedTo] : 'Not Assigned'}
    `.trim();

    // Encode the message for URL
    const encodedMessage = encodeURIComponent(message);
    
    // Create WhatsApp Web URL
    const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;
    
    // Open in new tab
    window.open(whatsappUrl, '_blank');
  };

  const handleExportToCSV = (leads: Lead[], filename: string) => {
    // Define the headers for CSV
    const headers = [
      'Name',
      'Email',
      'Phone',
      'Interested Country',
      'Status',
      'Assigned To',
      'Created At'
    ];

    // Format the data for CSV
    const csvData = leads.map(lead => [
      lead.name,
      lead.email,
      lead.phone,
      lead.interestedCountry,
      lead.status,
      lead.assignedTo ? counselorsName[lead.assignedTo] : 'Not Assigned',
      new Date(lead.createdAt).toLocaleDateString()
    ]);

    // Combine headers and data
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    // Create and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleExportAll = () => {
    const leads = activeTab === 'pending' ? pendingLeads : acceptedLeads;
    const filename = `${activeTab}-leads-${new Date().toISOString().split('T')[0]}.csv`;
    handleExportToCSV(leads, filename);
    toast.success('Export started');
  };

  const handleExportSelected = () => {
    if (selectedLeads.length === 0) {
      toast.error('Please select leads to export');
      return;
    }

    const leads = (activeTab === 'pending' ? pendingLeads : acceptedLeads)
      .filter(lead => selectedLeads.includes(lead._id));
    const filename = `selected-${activeTab}-leads-${new Date().toISOString().split('T')[0]}.csv`;
    handleExportToCSV(leads, filename);
    toast.success(`Exporting ${selectedLeads.length} leads`);
  };

  return (
    <AdminLayout>
      <Toaster />
      {deleteConfirmation.isOpen && (
        <div className="fixed inset-0 z-[9999] overflow-y-auto">
          <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"></div>
          <div className="flex min-h-screen items-center justify-center p-4 text-center">
            <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
              <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <TrashIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
                  </div>
                  <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                    <h3 className="text-lg font-semibold leading-6 text-gray-900">
                      Delete Lead
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to delete this lead? This action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <button
                  type="button"
                  onClick={handleDeleteConfirm}
                  className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                >
                  Delete
                </button>
                <button
                  type="button"
                  onClick={handleDeleteCancel}
                  className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="py-6">
        <div className="px-4 sm:px-6 md:px-8">
          <h1 className="text-2xl font-semibold text-gray-900">View Leads</h1>
          <BreadcrumbAdmin/>
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
          <div className="mt-8">
            <div className="bg-white shadow rounded-lg">
              {/* Tabs with Export Buttons */}
              <div className="border-b border-gray-200">
                <div className="flex justify-between items-center px-6">
                  <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                    <button
                      onClick={() => setActiveTab('pending')}
                      className={`${
                        activeTab === 'pending'
                          ? 'border-teal-500 text-teal-600'
                          : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                      } whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium`}
                    >
                      Pending Leads ({pendingLeads.length})
                    </button>
                    <button
                      onClick={() => setActiveTab('accepted')}
                      className={`${
                        activeTab === 'accepted'
                          ? 'border-teal-500 text-teal-600'
                          : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                      } whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium`}
                    >
                      Accepted Leads ({acceptedLeads.length})
                    </button>
                  </nav>
                  
                  <div className="flex space-x-3">
                    <button
                      onClick={handleExportSelected}
                      className={`px-3 py-2 text-sm font-medium rounded-md ${
                        selectedLeads.length > 0
                          ? 'bg-teal-100 text-teal-700 hover:bg-teal-200'
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                      disabled={selectedLeads.length === 0}
                    >
                      Export Selected ({selectedLeads.length})
                    </button>
                    <button
                      onClick={handleExportAll}
                      className="px-3 py-2 text-sm font-medium rounded-md bg-teal-600 text-white hover:bg-teal-700"
                    >
                      Export All
                    </button>
                  </div>
                </div>
              </div>

              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
                </div>
              ) : error ? (
                <div className="p-4 text-red-600">{error}</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left">
                          <input
                            type="checkbox"
                            className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                            onChange={handleSelectAll}
                            checked={selectedLeads.length === currentItems.length && currentItems.length > 0}
                          />
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          S.No
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Contact
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Preferred Country
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {activeTab === 'pending' ? 'Assign Counsellor' : 'Status'}
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {currentItems.map((lead,index) => (
                        <tr key={lead._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <input
                              type="checkbox"
                              className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                              checked={selectedLeads.includes(lead._id)}
                              onChange={() => handleSelectLead(lead._id)}
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {index + 1}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                                <div className="text-sm font-medium text-gray-900">{lead.name}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {lead.phone}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                            <a href={`mailto:${lead.email}`}>{lead.email}</a>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {lead.interestedCountry}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {activeTab === 'pending' ? (
                              <div className="relative">
                                <button
                                  onClick={() => setOpenDropdownId(openDropdownId === lead._id ? null : lead._id)}
                                  className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-sm font-medium inline-flex items-center"
                                >
                                  Assign
                                  <ChevronDownIcon className="w-4 h-4 ml-1" />
                                </button>
                                {openDropdownId === lead._id && (
                                  <div className="absolute z-10 mt-2 w-min rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                                    <div className="py-1 max-h-48 overflow-auto" role="menu" aria-orientation="vertical">
                                      {counselors.map((counselor) => (
                                        <p>
                                        <button
                                          key={counselor._id}
                                          onClick={() => assignCounsellor(lead._id, counselor._id,counselor.firstName + " " + counselor.lastName)}
                                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                          role="menuitem"
                                        >
                                          {counselor.firstName} {counselor.lastName}
                                        </button>
                                        </p>

                                      ))}
                                      {counselors.length === 0 && (
                                        <div className="px-4 py-2 text-sm text-gray-500">
                                          No counselors available
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </div>
                            ) : (
                              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                                {lead.assignedTo ? (counselorsName[lead.assignedTo]) : 'Not Assigned'}
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex space-x-3">
                              <button onClick={() => handleDeleteClick(lead._id)} className="text-gray-600 hover:text-gray-900">
                                <TrashIcon className="h-5 w-5" />
                              </button>
                              <button 
                                onClick={() => handleShareOnWhatsApp(lead)}
                                className="text-gray-600 hover:text-gray-900"
                                title="Share on WhatsApp"
                              >
                                <ShareIcon className="h-5 w-5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-end p-4 gap-2">
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
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ViewLeads;
