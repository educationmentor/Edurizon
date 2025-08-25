import Layout from '@/components/admin/DocumentLayout';
import { useState } from 'react';
import BreadcrumbAdmin from '@/components/BreadcumbAdmin';
import { useEffect } from 'react';
import { baseUrl } from '@/lib/baseUrl';
import axios from 'axios';
import {  TrashIcon, ShareIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import toast, { Toaster } from 'react-hot-toast';
import CallingDetails from '@/components/admin/counsellor-components/callingDetails';


interface Lead {
  assignedTo: any;
  _id: string;
  name: string;
  email: string;
  phone: string;
  interestedCountry: string;
  status: 'pending' | 'assigned'  | 'completed';
  counsellingStatus: 'pending' | 'completed';
  typeofLead: 'warm' | 'cold' | 'hot';   
  meetingTime?: string;
  googleMeetLink?: string;
  createdAt: string;
}

const navItems = [
    {
      href: "/admin/counsellor",
      icon: "/assets/Images/admin/overview.svg",
      label: "Overview",
    },
  {
    href: "/admin/counsellor/calling-records",
    icon: "/assets/Images/admin/session-records.svg",
    label: "Calling Records",
  },
  {
    href: "/admin/counsellor/messages",
    icon: "/assets/Images/admin/message.svg",
    label: "Messages",
  },
  {
    href: "/admin/counsellor/view-sessions",
    icon: "/assets/Images/admin/message.svg",
    label: "View Sessions",
  },
];

const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [adminData, setAdminData] = useState<any>(null);
  useEffect(() => {
    if(sessionStorage.getItem('adminData')){
      const value = sessionStorage.getItem('adminData');
      const parsedValue = JSON.parse(value || '{}');
      setAdminData(parsedValue);
    }
    else{
      const value = localStorage.getItem('adminData');
      const parsedValue = JSON.parse(value || '{}');
      setAdminData(parsedValue);
    }
  }, []);
  

  return (
     <Layout navItems={navItems} searchTerm={searchTerm} setSearchTerm={setSearchTerm}>
      <Toaster />
      <div>
        <CallingDetails adminData={adminData} ITEMS_PER_PAGE={10} />
      </div>
      </Layout>

  );
};

export default Dashboard;