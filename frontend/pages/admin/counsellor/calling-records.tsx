import React, { useState, useEffect } from 'react';
import AdminTable from '@/components/admin/AdminTable';
import { getLeadsByCounsellor, updateLeadStatus } from '@/services/api';
import toast, { Toaster } from 'react-hot-toast';
import Layout from '@/components/admin/DocumentLayout';
import GridViewIcon from '@mui/icons-material/GridView';
import CallIcon from '@mui/icons-material/Call';
import MessageIcon from '@mui/icons-material/Message';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

interface Lead {
  _id: string;
  name: string;
  phone: string;
  countryInterested: string;
  courseName: string;
  callingStatus: 'pending' | 'follow-up' | 'no-answer' | 'not-interested';
  leadType: 'pending' | 'follow-up' | 'negative' | 'completed' | 'registered';
  leadStatus: 'pending' | 'hot' | 'warm' | 'cold' | 'negative' | 'completed';
  remark: string;
  updatedAt: string;
  assignedCounsellor: any;
}

const CallingRecords = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([]);
  const [adminData, setAdminData] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const navItems = [
    {
      href: "/admin/counsellor",
      icon: <GridViewIcon />,
      label: "Overview",
    },
  {
    href: "/admin/counsellor/calling-records",
    icon: <CallIcon />,
    label: "Calling Records",
  },
  {
    href: "/admin/counsellor/messages",
    icon: <MessageIcon />,
    label: "Messages",
  },
  // {
  //   href: "/admin/counsellor/view-sessions",
  //   icon: <ArrowForwardIosIcon />,
  //   label: "View Sessions",
  // },
];

  // Get counsellor ID from sessionStorage or localStorage
  const counsellorId = adminData?._id;

  const ITEMS_PER_PAGE = 10;

  // Fetch leads for the counsellor
  const fetchLeads = async () => {
    if (!counsellorId) {
      setError('Counsellor ID not found');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const response = await getLeadsByCounsellor(counsellorId);
      if (response.success) {
        setLeads(response.data);
      } else {
        setError(response.message || 'Failed to fetch leads');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch leads');
    } finally {
      setLoading(false);
    }
  };

  // Filter leads based on active tab
  useEffect(() => {
    if (activeTab === 'all') {
      setFilteredLeads(leads);
    } else if (activeTab === 'followup') {
      setFilteredLeads(leads.filter(lead => lead.leadType === 'follow-up'));
    } else {
      setFilteredLeads(leads.filter(lead => lead.leadType === activeTab));
    }
  }, [activeTab, leads]);

  // Fetch admin data on component mount
  useEffect(() => {
    if (sessionStorage.getItem('adminData')) {
      const value = sessionStorage.getItem('adminData');
      const parsedValue = JSON.parse(value || '{}');
      setAdminData(parsedValue);
    } else {
      const value = localStorage.getItem('adminData');
      const parsedValue = JSON.parse(value || '{}');
      setAdminData(parsedValue);
    }
  }, []);

  // Fetch leads on component mount
  useEffect(() => {
    fetchLeads();
  }, [counsellorId]);

  // Handle status updates
  const handleStatusUpdate = async (leadId: string, field: 'callingStatus' | 'leadType' | 'leadStatus', value: string) => {
    try {
      let updateData: any = {};
      if (field === 'callingStatus') {
        updateData = { callingStatus: value };
      } else if (field === 'leadType') {
        updateData = { leadType: value };
      } else if (field === 'leadStatus') {
        updateData = { leadStatus: value };
      }
      
      const response = await updateLeadStatus(leadId, updateData);
      
      if (response.success) {
        // Update local state
        setLeads(prevLeads => 
          prevLeads.map(lead => 
            lead._id === leadId 
              ? { ...lead, [field]: value, updatedAt: new Date().toISOString() }
              : lead
          )
        );
        
        let fieldLabel = '';
        if (field === 'callingStatus') fieldLabel = 'Calling status';
        else if (field === 'leadType') fieldLabel = 'Lead type';
        else if (field === 'leadStatus') fieldLabel = 'Category';
        
        toast.success(`${fieldLabel} updated successfully`);
      } else {
        toast.error(response.message || 'Failed to update status');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message || 'Failed to update status');
    }
  };

  // Define tabs
  const tabs = [
    { key: 'all', label: 'All', count: leads.length },
    { key: 'pending', label: 'Pending', count: leads.filter(lead => lead.leadType === 'pending').length },
    { key: 'followup', label: 'Follow Up', count: leads.filter(lead => lead.leadType === 'follow-up').length },
    { key: 'negative', label: 'Negative', count: leads.filter(lead => lead.leadType === 'negative').length },
    { key: 'completed', label: 'Completed', count: leads.filter(lead => lead.leadType === 'completed').length },
    { key: 'registered', label: 'Registered', count: leads.filter(lead => lead.leadType === 'registered').length },
  ];

  // Table headers
  const tableHeaders = [
    "S.No",
    "Student Name",
    "Country",
    "Contact Number",
    "Course",
    "Calling Status",
    "Lead Type",
    "Category",
    "Remark",
    "Calling Date"
  ];

  // CSV headers
  const csvHeader = [
    "Student Name",
    "Country",
    "Contact Number",
    "Course",
    "Calling Status",
    "Lead Type",
    "Category",
    "Remark",
    "Calling Date"
  ];

  // CSV data fields
  const csvDataFields = [
    "name",
    "countryInterested",
    "phone",
    "courseName",
    "callingStatus",
    "leadType",
    "leadStatus",
    "remark",
    "updatedAt"
  ];

  // Table columns configuration
  const tableColumns = [
    {
      key: "sno",
      render: (lead: Lead, index: number) => index + 1,
    },
    {
      key: "name",
      render: (lead: Lead) => (
        <div className="text-sm font-medium text-gray-900">{lead.name}</div>
      ),
    },
    {
      key: "country",
      render: (lead: Lead) => (
        <span className="text-sm text-gray-500">{lead.countryInterested || 'None'}</span>
      ),
    },
    {
      key: "phone",
      render: (lead: Lead) => (
        <span className="text-sm text-gray-500">{lead.phone || 'None'}</span>
      ),
    },
    {
      key: "course",
      render: (lead: Lead) => (
        <span className="text-sm text-gray-500">{lead.courseName || 'None'}</span>
      ),
    },
    {
      key: "callingStatus",
      render: (lead: Lead) => {
        const getCallingStatusColor = (status: string) => {
          switch (status) {
            case 'pending': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
            case 'follow-up': return 'text-blue-600 bg-blue-50 border-blue-200';
            case 'no-answer': return 'text-orange-600 bg-orange-50 border-orange-200';
            case 'not-interested': return 'text-red-600 bg-red-50 border-red-200';
            default: return 'text-gray-500 bg-gray-50 border-gray-200';
          }
        };

        return (
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${lead.callingStatus === 'pending' ? 'bg-yellow-400' : lead.callingStatus === 'follow-up' ? 'bg-blue-400' : lead.callingStatus === 'no-answer' ? 'bg-orange-400' : 'bg-red-400'}`}></div>
            <select
              value={lead.callingStatus}
              onChange={(e) => handleStatusUpdate(lead._id, 'callingStatus', e.target.value)}
              className={`text-sm border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent font-medium ${getCallingStatusColor(lead.callingStatus)}`}
            >
              <option value="pending" className="bg-white text-yellow-600">⏳ Pending</option>
              <option value="follow-up" className="bg-white text-blue-600">📞 Follow Up</option>
              <option value="no-answer" className="bg-white text-orange-600">📵 No Answer</option>
              <option value="not-interested" className="bg-white text-red-600">❌ Not Interested</option>
            </select>
          </div>
        );
      },
    },
    {
      key: "leadType",
      render: (lead: Lead) => {
        const getLeadTypeColor = (type: string) => {
          switch (type) {
            case 'pending': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
            case 'follow-up': return 'text-blue-600 bg-blue-50 border-blue-200';
            case 'negative': return 'text-red-600 bg-red-50 border-red-200';
            case 'completed': return 'text-green-600 bg-green-50 border-green-200';
            case 'registered': return 'text-purple-600 bg-purple-50 border-purple-200';
            default: return 'text-gray-500 bg-gray-50 border-gray-200';
          }
        };

        return (
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${lead.leadType === 'pending' ? 'bg-yellow-400' : lead.leadType === 'follow-up' ? 'bg-blue-400' : lead.leadType === 'negative' ? 'bg-red-400' : lead.leadType === 'completed' ? 'bg-green-400' : 'bg-purple-400'}`}></div>
            <select
              value={lead.leadType}
              onChange={(e) => handleStatusUpdate(lead._id, 'leadType', e.target.value)}
              className={`text-sm border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent font-medium ${getLeadTypeColor(lead.leadType)}`}
            >
              <option value="pending" className="bg-white text-yellow-600">⏳ Pending</option>
              <option value="follow-up" className="bg-white text-blue-600">📞 Follow Up</option>
              <option value="negative" className="bg-white text-red-600">❌ Negative</option>
              <option value="completed" className="bg-white text-green-600">✅ Completed</option>
              <option value="registered" className="bg-white text-purple-600">🎓 Registered</option>
            </select>
          </div>
        );
      },
    },
    {
      key: "category",
      render: (lead: Lead) => {
        const getStatusColor = (status: string) => {
          switch (status) {
            case 'hot': return 'text-red-600 bg-red-50 border-red-200';
            case 'warm': return 'text-orange-600 bg-orange-50 border-orange-200';
            case 'cold': return 'text-blue-600 bg-blue-50 border-blue-200';
            case 'negative': return 'text-gray-600 bg-gray-50 border-gray-200';
            case 'completed': return 'text-green-600 bg-green-50 border-green-200';
            default: return 'text-gray-500 bg-gray-50 border-gray-200';
          }
        };

        const getStatusIcon = (status: string) => {
          switch (status) {
            case 'hot': return '🔥';
            case 'warm': return '🟠';
            case 'cold': return '🔵';
            case 'negative': return '⚫';
            case 'completed': return '✅';
            default: return '⏳';
          }
        };

        return (
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${lead.leadStatus === 'pending' ? 'bg-gray-400' : lead.leadStatus === 'hot' ? 'bg-red-400' : lead.leadStatus === 'warm' ? 'bg-orange-400' : lead.leadStatus === 'cold' ? 'bg-blue-400' : lead.leadStatus === 'negative' ? 'bg-gray-600' : 'bg-green-400'}`}></div>
            <select
              value={lead.leadStatus || 'pending'}
              onChange={(e) => handleStatusUpdate(lead._id, 'leadStatus', e.target.value)}
              className={`text-sm border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent font-medium ${getStatusColor(lead.leadStatus || 'pending')}`}
            >
              <option value="pending" className="bg-white text-gray-500">⏳ Pending</option>
              <option value="hot" className="bg-white text-red-600">🔥 Hot</option>
              <option value="warm" className="bg-white text-orange-600">🟠 Warm</option>
              <option value="cold" className="bg-white text-blue-600">🔵 Cold</option>
              <option value="negative" className="bg-white text-gray-600">⚫ Negative</option>
              <option value="completed" className="bg-white text-green-600">✅ Completed</option>
            </select>
          </div>
        );
      },
    },
    {
      key: "remark",
      render: (lead: Lead) => (
        <span className="text-sm text-gray-500 max-w-xs truncate" title={lead.remark}>
          {lead.remark || 'No remarks'}
        </span>
      ),
    },
    {
      key: "callingDate",
      render: (lead: Lead) => (
        <span className="text-sm text-gray-500">
          {new Date(lead.updatedAt).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
          })}
        </span>
      ),
    },
  ];

  // Handle tab change
  const handleTabChange = (tabKey: string) => {
    setActiveTab(tabKey);
  };

  // Refresh data
  const handleRefresh = () => {
    fetchLeads();
  };

  if (!adminData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mx-auto mb-4"></div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Loading...</h2>
          <p className="text-gray-600">Please wait while we load your data...</p>
        </div>
      </div>
    );
  }

  if (!counsellorId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">Counsellor ID not found. Please log in again.</p>
          <div className="mt-4">
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Layout navItems={navItems} searchTerm={searchTerm} setSearchTerm={setSearchTerm}>
      <Toaster />
      
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Calling Records</h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage and track leads assigned to you
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleRefresh}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="rounded-[12px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Status Legend */}
        {/* <div className="bg-white rounded-lg shadow mb-6 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Status Legend</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Calling Status</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <span className="text-sm text-gray-600">Pending</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-blue-400"></div>
                  <span className="text-sm text-gray-600">Follow Up</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-orange-400"></div>
                  <span className="text-sm text-gray-600">No Answer</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <span className="text-sm text-gray-600">Not Interested</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Lead Type</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <span className="text-sm text-gray-600">Pending</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-blue-400"></div>
                  <span className="text-sm text-gray-600">Follow Up</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <span className="text-sm text-gray-600">Negative</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  <span className="text-sm text-gray-600">Completed</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-purple-400"></div>
                  <span className="text-sm text-gray-600">Registered</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Category</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                  <span className="text-sm text-gray-600">Pending</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <span className="text-sm text-gray-600">Hot</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-orange-400"></div>
                  <span className="text-sm text-gray-600">Warm</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-blue-400"></div>
                  <span className="text-sm text-gray-600">Cold</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-gray-600"></div>
                  <span className="text-sm text-gray-600">Negative</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  <span className="text-sm text-gray-600">Completed</span>
                </div>
              </div>
            </div>
          </div>
        </div> */}
        
        <div className="bg-white rounded-lg shadow">
          <AdminTable
            ITEMS_PER_PAGE={ITEMS_PER_PAGE}
            tableHeaders={tableHeaders}
            tableColumns={tableColumns}
            leads={filteredLeads}
            loading={loading}
            error={error}
            csvHeader={csvHeader}
            csvDataFields={csvDataFields}
            tabs={tabs}
            activeTab={activeTab}
            setActiveTab={handleTabChange}
            bgColor="bg-white"
          />
        </div>
      </div>
    </Layout>
  );
};

export default CallingRecords;
