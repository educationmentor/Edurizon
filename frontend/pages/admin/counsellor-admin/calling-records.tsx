import React, { useState,useEffect } from 'react'
import DocumentLayout from '@/components/admin/DocumentLayout'
import CallingRecordComponent from '@/components/admin/counsellor-admin-components/callingRecordComponent';
const navItems = [
    {
      href: "/admin/counsellor-admin",
      icon: "/assets/Images/admin/overview.svg",
      label: "Overview",
    },
    {
        href: "/admin/counsellor-admin/calling-records",
        icon: "/assets/Images/admin/overview.svg",
        label: "Calling Records",
    },
    {
        href: "/admin/counsellor-admin/view-sessions",
        icon: "/assets/Images/admin/overview.svg",
        label: "View Sessions",
    },
  ]

const CounsellorAdmin = () => {
    const [searchTerm, setSearchTerm] = useState('');
     // Table Data
    
    const [adminData, setAdminData] = useState<any>(null);
    useEffect(() => {
        if(sessionStorage.getItem('adminData')){
          const value = sessionStorage.getItem('adminData');
          const parsedValue = JSON.parse(value || '{}');
          setAdminData(parsedValue);
        }else{
          const value = localStorage.getItem('adminData');
          const parsedValue = JSON.parse(value || '{}');
          setAdminData(parsedValue);
        }
      }, []);
    

    return (
    <div>
      <DocumentLayout navItems={navItems} searchTerm={searchTerm} setSearchTerm={setSearchTerm}>
        <div>
            <CallingRecordComponent/>
        </div>
        </DocumentLayout>
    </div>
  )
}


export default CounsellorAdmin
