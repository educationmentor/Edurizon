import React, { useState, useEffect } from 'react';
import DocumentLayout from '@/components/admin/DocumentLayout';
import BreadcrumbAdmin from '@/components/BreadcumbAdmin';
import { baseUrl } from '@/lib/baseUrl';
import axios from 'axios';
import { PencilIcon, TrashIcon, EyeIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import toast, { Toaster } from 'react-hot-toast';
import AdminTable from '@/components/admin/AdminTable';
import leads from '../superadmin/leads';

const navItems = [
  {
    href: "/admin/document",
    icon: "/assets/Images/admin/overview.svg",
    label: "Overview",
  }
]

const  tableHeaders = [
  "S.No",
  "Student Name",
  "Country",
  "Contact Number",
  "Email",
  "Status of Upload",
  "Uploaded Documents",
];

const csvHeader=[
  'Student Name',
  'Country Studying',
  'Contact Number',
  'Email',
  'Status of Upload',
  'Uploaded Documents',
];

const csvDataFields = [
  'name',
  'interestedCountry',
  'phone',
  'email',
  'counsellingStatus',
  'typeofLead',
  'createdAt'
];

const DocumentManagement = () => {
  // Navbar Search
  const [searchTerm, setSearchTerm] = useState('');

  // Action Button
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [openDropdownId2, setOpenDropdownId2] = useState<string | null>(null);  

  // Table Data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [adminData, setAdminData] = useState<any>(null);
  const [pendingLeads, setPendingLeads] = useState<any[]>([]);
  const [completedLeads, setCompletedLeads] = useState<any[]>([]);

  const tableColumns = [
  {
    key: "sno",
    render: (lead:any, index:number) => index + 1,
  },
  {
    key: "name",
    render: (lead:any) => (
      <div className="flex items-center">
        <div className="text-sm font-medium text-gray-900">{lead.name}</div>
      </div>
    ),
  },
  {
    key: "phone",
    render: (lead:any) => (
      <span className="text-sm text-gray-500">{lead.phone}</span>
    ),
  },
  {
    key: "email",
    render: (lead:any) => (
      <a
        href={`mailto:${lead.email}`}
        className="text-sm text-blue-600"
      >
        {lead.email}
      </a>
    ),
  },
  {
    key: "interestedCountry",
    render: (lead:any) => (
      <span className="text-sm text-gray-500">{lead.interestedCountry}</span>
    ),
  },
  {
    key: "counsellingStatus",
    render: (lead:any) => (
      <div className="relative">
        <button
          onClick={() =>
            setOpenDropdownId2(openDropdownId2 === lead._id ? null : lead._id)
          }
          className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-sm font-medium inline-flex items-center"
        >
          {lead.counsellingStatus}
          <ExpandMoreIcon className="w-4 h-4 ml-1" />
        </button>
        {openDropdownId2 === lead._id && (
          <div className="absolute z-10 mt-2 w-min rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
            <div
              className="py-1 max-h-48"
              role="menu"
              aria-orientation="vertical"
            >
              <button
                onClick={()=>{}
                }
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Pending
              </button>
              <button
                onClick={()=>{}
                }
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Completed
              </button>
            </div>
          </div>
        )}
      </div>
    ),
  },
  {
    key: "typeofLead",
    render: (lead:any) => (
      <div className="relative">
        <button
          onClick={() =>
            setOpenDropdownId(openDropdownId === lead._id ? null : lead._id)
          }
          className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-sm font-medium inline-flex items-center"
        >
          {lead.typeofLead}
          <ExpandMoreIcon className="w-4 h-4 ml-1" />
        </button>
        {openDropdownId === lead._id && (
          <div className="absolute z-10 mt-2 w-min rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
            <div
              className="py-1 max-h-48"
              role="menu"
              aria-orientation="vertical"
            >
              <button
                onClick={() =>{}}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Warm
              </button>
              <button
                onClick={() =>{}}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Cold
              </button>
              <button
                onClick={() =>{}}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Hot
              </button>
            </div>
          </div>
        )}
      </div>
    ),
  },

  ];

  useEffect(() => {
    const value = localStorage.getItem('adminData');
    const parsedValue = JSON.parse(value || '{}');
    setAdminData(parsedValue);
  }, []);

    
   useEffect(() => {
    if(adminData){fetchLeads();
  }
  }, [adminData]);




    // Tabs and its 
  const [activeTab, setActiveTab] = useState('pending');

   const tabs = [
    { key: "All Students", label: "All Students", count: pendingLeads.length + completedLeads.length },
    ];


    // Leads Filtering And Fetching
  const filterLeads = (leads:any) => {
    const pendingLeads = leads.filter((lead:any) => lead.counsellingStatus === 'pending');
    const completedLeads = leads.filter((lead:any) => lead.counsellingStatus === 'completed');
    setPendingLeads(pendingLeads);
    setCompletedLeads(completedLeads);
  }
  const fetchLeads = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        if (!token) {
          setError('Not authenticated. Please log in again.');
          return;
        }

        // Ensure token has Bearer prefix
        const authToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
        const assignedRes = await axios.get(`${baseUrl}/api/admin/consultation/assigned/${adminData?._id}`, {
          headers: { 
            Authorization: authToken
          }
        });
        if (assignedRes.data.success) {
          filterLeads(assignedRes.data.data);
        }
      } catch (err: any) {
        console.log("err",err);
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
  const [currentLeads,setCurrentLeads] = useState<any[]>([]);
  useEffect(() => {
    setCurrentLeads(activeTab === 'pending' ? pendingLeads : completedLeads);
  }, [activeTab, pendingLeads, completedLeads]);

  console.log(activeTab)
  return (
    <DocumentLayout navItems={navItems} searchTerm={searchTerm} setSearchTerm={setSearchTerm}>
      <Toaster />
      <div>
        <div className="py-8">
            <div className="px-4 sm:px-6 md:px-8">
            <h1 className="text-2xl font-semibold text-gray-900">Document Management</h1>
          </div>
        </div>
        <AdminTable ITEMS_PER_PAGE={10} tableHeaders={tableHeaders} tableColumns={tableColumns} leads={currentLeads} loading={loading} error={error} csvHeader={csvHeader} csvDataFields={csvDataFields} tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
    </DocumentLayout>
  );
};

export default DocumentManagement;
