import React, { useState,useEffect } from 'react'
import DocumentLayout from '@/components/admin/DocumentLayout'
import AdminTable from '@/components/admin/AdminTable';
import { TransitionLink } from '@/utils/TransitionLink';
const navItems = [
    {
      href: "/admin/digital",
      icon: "/assets/Images/admin/overview.svg",
      label: "Overview",
    }
  ]

const DigitalTeam = () => {
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
            {
                adminData?.role=='super-admin'?<SuperAdminTable/>:<MemberTable adminData={adminData}/>
            }
        </div>
        </DocumentLayout>
    </div>
  )
}

const SuperAdminTable: React.FC = () => {

    return(
    <div>
        hi
    </div>
)
}

const MemberTable: React.FC<{adminData:any}> = ({adminData}) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const  tableHeaders = [
        "S.No",
        "Video Name",
        "Date of Shoot",
        "Video Edited",
        "Thumbnail Created",
        "Caption Added",
        "Video Uploaded",
        'Date of Upload',
        'Platform',
        'Description'
      ];
      
      const csvHeader=[
        'Video Name',
        'Date of Shoot',
        'Video Edited',
        'Thumbnail Created',
        'Caption',
        'Video Uploaded',
        'Date of Upload',
        'Platform',
        'Description'
      ];
      
      const csvDataFields = [
        'videoName',
        'dateOfShoot',
        'videoEdited',
        'thumbnailUploaded',
        'captionAdded',
        'videoUploaded',
        'uploadDate',
        'platform',
        'description'
      ];

      const tableColumns = [
        {
          key: "sno",
          render: (video:any, index:number) => index + 1,
        },
        {
          key: "name",
          render: (video:any) => (
            <div className="flex items-center">
              <div className="text-sm font-medium text-gray-900">{video.videoName}</div>
            </div>
          ),
        },
        {
          key: "dateOfShoot",
          render: (video:any) => (
            <span className="text-sm text-gray-500">{video.dateOfShoot}</span>
          ),
        },
        {
          key: "videoEdited",
          render: (video:any) => (
      
              <span className="text-sm text-gray-500">{String(video.videoEdited)}</span>
          ),
        },
        {
          key: "email",
          render: (video:any) => (
                  <a
              className="text-sm text-gray-500"
              href={`mailto:${video.email}`}
            >
            <span className="text-sm text-gray-500">{video.email}</span>
            </a>
          ),
        },
        {
          key: "documentsUploadStatus",
          render: (video:any) => (
            <div className="relative">
              <button
                onClick={() =>
                  {}
                }
                className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-sm font-medium  items-center"
              >
                {video.documentsUploadStatus}
              </button>
              
            </div>
          ),
        },
        {
          key: "view",
          render: (video:any) => (
            <div className="relative">
              <TransitionLink href={`/admin/document/${video._id}`}>
                <button
                  className="bg-teal-100  text-teal-800 px-[64px] py-[8px] rounded-full text-sm font-medium  items-center"
              >
                View
              </button>
              </TransitionLink>
            </div>
          ),
        },
        ];
        const [activeTab, setActiveTab] = useState('allStudents');

   const tabs = [
    { key: "allStudents", label: "All Students", count: adminData?.digitalMarketingVideos?.length??0},
    ];
      
      
return (
    <div>
        <AdminTable ITEMS_PER_PAGE={10} tableColumns={tableColumns} tableHeaders={tableHeaders} csvHeader={csvHeader} csvDataFields={csvDataFields} loading={loading} error={error} 
        leads={adminData?.digitalMarketingVideos??[]} setActiveTab={setActiveTab} tabs={tabs} activeTab={activeTab} />
    </div>
)
}

export default DigitalTeam
