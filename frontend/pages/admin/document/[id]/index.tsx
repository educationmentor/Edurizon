import React,{useState,useEffect} from "react";
import { GetServerSideProps } from "next";
import DocumentLayout from "@/components/admin/DocumentLayout";
import AdminTable from "@/components/admin/AdminTable";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { baseUrl } from "@/lib/baseUrl";
import axios from "axios";
import toast, { Toaster } from 'react-hot-toast';
import AnnouncementIcon from '@mui/icons-material/Announcement';
import AnnouncementOutlinedIcon from '@mui/icons-material/AnnouncementOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import CloseIcon from '@mui/icons-material/Close';
import DownloadIcon from '@mui/icons-material/Download';
import GridViewIcon from '@mui/icons-material/GridView';    

type DocumentPageProps = {
  id: string;
};
const navItems = [
  {
    href: "/admin/document",
    icon: <GridViewIcon />,
    label: "Overview",
  }
]

const  tableHeaders = [
  "S.No",
  "Document Name",
  "View Document",
  "Verification Status",
  "Action Buttons",
];

const csvHeader=[
  'Document Name',
  'Document Link',
  'Verification Status',
];

const csvDataFields = [
  'name',
  'link',
  'status',
];

// Document Viewer Overlay Component
const DocumentViewerOverlay: React.FC<{
  isOpen: boolean;
  document: any;
  onClose: () => void;
  onDownload: () => void;
}> = ({ isOpen, document, onClose, onDownload }) => {
  if (!isOpen || !document) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            {document.name}
          </h3>
          <div className="flex items-center space-x-3">
            <button
              onClick={onDownload}
              className="flex items-center px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors"
            >
              <DownloadIcon className="w-4 h-4 mr-2" />
              Download
            </button>
            <button
              onClick={onClose}
              className="flex items-center px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
            >
              <CloseIcon className="w-4 h-4 mr-2" />
              Close
            </button>
          </div>
        </div>

        {/* Document Content */}
        <div className="p-6 overflow-auto max-h-[calc(90vh-120px)]">
          {document.link ? (
            <div className="w-full h-full">
              {/* Check if it's an image */}
              {document.link.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                <img
                  src={document.link}
                  alt={document.name}
                  className="max-w-full h-auto mx-auto"
                />
              ) : (
                /* Check if it's a PDF */
                document.link.match(/\.pdf$/i) ? (
                  <iframe
                    src={document.link}
                    className="w-full h-[70vh] border-0"
                    title={document.name}
                  />
                ) : (
                  /* For other file types, show a download link */
                  <div className="text-center py-12">
                    <div className="text-gray-500 mb-4">
                      <DownloadIcon className="w-16 h-16 mx-auto text-gray-400" />
                    </div>
                    <p className="text-lg text-gray-700 mb-4">
                      This document cannot be previewed directly.
                    </p>
                    <p className="text-sm text-gray-500 mb-6">
                      Click the download button above to view the file.
                    </p>
                    <a
                      href={document.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-6 py-3 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors"
                    >
                      <DownloadIcon className="w-4 h-4 mr-2" />
                      Open in New Tab
                    </a>
                  </div>
                )
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-500 mb-4">
                <AnnouncementOutlinedIcon className="w-16 h-16 mx-auto text-gray-400" />
              </div>
              <p className="text-lg text-gray-700 mb-2">
                No document link available
              </p>
              <p className="text-sm text-gray-500">
                This document doesn't have a downloadable link.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const DocumentPage: React.FC<DocumentPageProps> = ({ id }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [userData, setUserData] = useState<any>(null);
    const [documentsList,setDocumentsList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
     const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);  
    const [selectedDocument, setSelectedDocument] = useState<any>(null);
    const [showOverlay, setShowOverlay] = useState(false);
    const [showAddDocumentOverlay, setShowAddDocumentOverlay] = useState(false);
    const [newDocumentName, setNewDocumentName] = useState('');
    const [showAnnouncementOverlay, setShowAnnouncementOverlay] = useState(false);
    const [selectedStudentForAnnouncement, setSelectedStudentForAnnouncement] = useState<any>(null);
    const [announcementEmail, setAnnouncementEmail] = useState('');
    const [announcementRemark, setAnnouncementRemark] = useState('');

    const tableColumns = [
  {
    key: "sno",
    render: (lead:any, index:number) => index+1,
  },
  
  {
    key: "documentName",
    render: (lead:any) => (
      <span className="text-sm text-gray-500">{lead.name}</span>
    ),
  },
  {
      key: "view",
      render: (lead:any) => (
        <div className="relative">
            <button
              onClick={() => handleViewDocument(lead)}
              className="bg-teal-100  text-teal-800 px-[32px] py-[8px] rounded-full text-sm font-medium  items-center"
          >
            View
          </button>
        </div>
      ),
  },
  {
    key: "verificationStatus",
    render: (lead:any) => (
      <div className="relative">
        <button
          onClick={() =>
            setOpenDropdownId(openDropdownId === lead.name ? null : lead.name)
          }
          className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-sm font-medium  items-center"
        >
          {lead.status}
          <ExpandMoreIcon className="w-4 h-4 ml-1" />
        </button>
        {openDropdownId === lead.name && (
          <div className="absolute z-10 mt-2 w-min rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
            <div>
              <button
                onClick={()=>{updateStatusOfUpload(id,"pending",lead.name);}
                }
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Pending
              </button>
              </div>
                <div>
            <button
                onClick={()=>{updateStatusOfUpload(id,"verified",lead.name);}
                }
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Verified
              </button>
              </div>
              <div>
            <button
                onClick={()=>{updateStatusOfUpload(id,"rejected",lead.name);}
                }
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Rejected
              </button>
              </div>
          </div>
        )}
      </div>
    ),
  },
  {
      key: "actionButtons",
      render: (lead:any) => (
        <div className="flex gap-[8px] items-center">
           
            <DeleteOutlinedIcon 
              className="cursor-pointer hover:text-red-600 transition-colors" 
              onClick={() => handleDeleteDocument(lead.name)}
              aria-label="Delete Document"
            />
            <AnnouncementOutlinedIcon 
              className="cursor-pointer hover:text-blue-600 transition-colors" 
              onClick={() => handleAnnouncementClick(lead)}
              aria-label="Send Announcement"
            />
            <ShareOutlinedIcon 
              className="cursor-pointer hover:text-blue-600 transition-colors" 
              onClick={() => handleShareDocument(lead)}
              aria-label="Share Document Status"
            />
            
        </div>
      ),
  },
 
  ];

  const extraButton= <button onClick={() => setShowAddDocumentOverlay(true)}
    className="px-3 py-2 text-sm font-medium rounded-md bg-teal-600 text-white hover:bg-teal-700">
    Add Document +
    </button>


    useEffect(() => {
      fetchUser();
    }, []);
    useEffect(()=>{
      filterDocumentList();
      // Update announcementEmail when userData changes
      if (userData?.email) {
        setAnnouncementEmail(userData.email);
        console.log('Setting announcement email to:', userData.email);
      }
    },[userData])

    const fetchUser=async()=>{
      try {
        const assignedRes = await axios.get(`${baseUrl}/api/registered-students/get-single/${id}`);
        if (assignedRes.data) {
          setUserData(assignedRes.data);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }finally {
        setLoading(false);
      }
    }

    
    const filterDocumentList =  ()=>{
      if(userData){
        const filteredDocuments = userData.documents.filter((doc:any) =>
          doc.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setDocumentsList(filteredDocuments);
      }
    }

      // Update Status of Upload
  const updateStatusOfUpload=async(id:string,status:string,documentName:string)=>{
    try {
      const response = await axios.put(
        `${baseUrl}/api/registered-students/updateDocumentConditionStatus/${id}`,
        { id, status,documentName },
      );
      if (response.data) {
        toast.success('Updated successfully', {
          duration: 3000,
          position: 'top-right',
          style: {
            background: '#10B981',
            color: '#fff',
            padding: '16px',
          },
        });
        setOpenDropdownId(null);
        fetchUser();
      }
    } catch (err: any) {
      console.log("err",err);
    }
  }

  const [activeTab, setActiveTab] = useState('allStudents');
  
     const tabs = [
      { key: "allStudents", label: `Documents By ${userData?userData.name:'Student'}`, count: documentsList.length },
      ];

    //View Document Overlay and Its functions
    const handleViewDocument = (document: any) => {
      setSelectedDocument(document);
      setShowOverlay(true);
    };

    const handleCloseOverlay = () => {
      setShowOverlay(false);
      setSelectedDocument(null);
    };

    const handleDownloadDocument = () => {
      if (selectedDocument?.link) {
        const link = document.createElement('a');
        link.href = selectedDocument.link;
        link.download = selectedDocument.name || 'document';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    };


    // Delete Document Name
    const handleDeleteDocument = async (documentName: string) => {
      try {
        const response = await axios.delete(`${baseUrl}/api/registered-students/deleteOneDocument/${id}`, {
          data: { documentName }
        });
        
        if (response.data) {
          toast.success('Document deleted successfully', {
            duration: 3000,
            position: 'top-right',
            style: {
              background: '#10B981',
              color: '#fff',
              padding: '16px',
            },
          });
          // Refresh the user data to show updated document list
          fetchUser();
        }
      } catch (err: any) {
        console.log("err", err);
        toast.error(err.response?.data?.error || 'Failed to delete document', {
          duration: 3000,
          position: 'top-right',
          style: {
            background: '#EF4444',
            color: '#fff',
            padding: '16px',
          },
        });
      }
    };

    const handleAddDocument = async (documentName: string) => {
      try {
        console.log('here')
        const response = await axios.post(`${baseUrl}/api/registered-students/addOneDocument/${id}`, {
          name: documentName
        });
        
        if (response.data) {
          toast.success('Document added successfully', {
            duration: 3000,
            position: 'top-right',
            style: {
              background: '#10B981',
              color: '#fff',
              padding: '16px',
            },
          });
          // Close overlay and reset form
          setShowAddDocumentOverlay(false);
          setNewDocumentName('');
          // Refresh the user data to show updated document list
          fetchUser();
        }
      } catch (err: any) {
        console.log("err", err);
        toast.error(err.response?.data?.error || 'Failed to add document', {
          duration: 3000,
          position: 'top-right',
          style: {
            background: '#EF4444',
            color: '#fff',
            padding: '16px',
          },
        });
      }
    };

    const handleAddDocumentSubmit = () => {
      if (!newDocumentName.trim()) {
        toast.error('Document name is required', {
          duration: 3000,
          position: 'top-right',
          style: {
            background: '#EF4444',
            color: '#fff',
            padding: '16px',
          },
        });
        return;
      }
      handleAddDocument(newDocumentName.trim());
    };

    const handleCloseAddDocumentOverlay = () => {
      setShowAddDocumentOverlay(false);
      setNewDocumentName('');
    };

    const handleAnnouncementClick = (lead: any) => {
      setSelectedStudentForAnnouncement(lead);
      // Use the student's email from the lead, not userData
      setAnnouncementEmail(userData.email || '');
      setAnnouncementRemark(`Dear ${userData.name},\n\nThis is an important announcement regarding your application with Edurizon.\n\nWe would like to inform you about the following:\n\nPlease Upload the Required Documents\n\nIf you have any questions or need clarification, please don't hesitate to contact our support team.\n\nBest regards,\nEdurizon Team`);
      setShowAnnouncementOverlay(true);
    };

    const handleSendAnnouncement = async () => {
      if (!announcementEmail.trim() || !announcementRemark.trim()) {
        toast.error('Please fill in both email and remark fields', {
          duration: 3000,
          position: 'top-right',
          style: {
            background: '#EF4444',
            color: '#fff',
            padding: '16px',
          },
        });
        return;
      }

      // Close overlay and reset form immediately when send button is clicked
      setShowAnnouncementOverlay(false);
      setSelectedStudentForAnnouncement(null);
      setAnnouncementEmail('');
      setAnnouncementRemark('');

      try {
        // Send the announcement email
        console.log("email before sending", announcementEmail)
        const response = await axios.post(`${baseUrl}/api/registered-students/sendRemark/${id}`, {
          email: announcementEmail,
          remark: announcementRemark
        });
        
        if (response.data) {
          // Show success toast after API success
          toast.success('Mail sent successfully!', {
            duration: 3000,
            position: 'top-right',
            style: {
              background: '#10B981',
              color: '#fff',
              padding: '16px',
            },
          });
          
          // Refresh the user data
          fetchUser();
        }
      } catch (err: any) {
        console.log("err", err);
        toast.error(err.response?.data?.error || 'Failed to send announcement', {
          duration: 3000,
          position: 'top-right',
          style: {
            background: '#EF4444',
            color: '#fff',
            padding: '16px',
          },
        });
      }
    };

    const handleCloseAnnouncementOverlay = () => {
      setShowAnnouncementOverlay(false);
      setSelectedStudentForAnnouncement(null);
      setAnnouncementEmail('');
      setAnnouncementRemark('');
    };

    const handleShareDocument = (document: any) => {
      if (!userData?.phone) {
        toast.error('Phone number not available for this student', {
          duration: 3000,
          position: 'top-right',
          style: {
            background: '#EF4444',
            color: '#fff',
            padding: '16px',
          },
        });
        return;
      }

      let message = '';
      
      if (document.status === 'rejected') {
        message = `Hello! Your document "${document.name}" has been rejected. Please reupload it as soon as possible. Contact us if you have any questions.`;
      } else if (document.status === 'pending') {
        message = `Hello! Your document "${document.name}" is still pending. Please upload it quickly to avoid delays in your application process.`;
      } else {
        message = `Hello! Regarding your document "${document.name}" (Status: ${document.status}). Please check your application portal for updates.`;
      }

      // Encode the message for WhatsApp
      const encodedMessage = encodeURIComponent(message);
      const phoneNumber = userData.phone.replace(/\D/g, ''); // Remove non-digits
      
      // Create WhatsApp URL
      const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
      
      // Open WhatsApp in new tab
      window.open(whatsappUrl, '_blank');
      
      toast.success('WhatsApp message prepared!', {
        duration: 2000,
        position: 'top-right',
        style: {
          background: '#10B981',
          color: '#fff',
          padding: '16px',
        },
      });
    };
  
  return (
    <DocumentLayout navItems={navItems} searchTerm={searchTerm} setSearchTerm={setSearchTerm}>
      <Toaster/>
      <div>
        <div className="py-8">
            <div className="px-4 sm:px-6 md:px-8">
            <h1 className="text-2xl font-semibold text-gray-900">Document Management</h1>
          </div>
        </div>
        <AdminTable ITEMS_PER_PAGE={10} tableHeaders={tableHeaders} tableColumns={tableColumns} 
        leads={documentsList} loading={loading} error={error} csvHeader={csvHeader} csvDataFields={csvDataFields} 
        tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} extraButtons={extraButton} />
      </div>

      {/* Document Viewer Overlay */}
      <DocumentViewerOverlay
        isOpen={showOverlay}
        document={selectedDocument}
        onClose={handleCloseOverlay}
        onDownload={handleDownloadDocument}
      />

      {/* Add Document Overlay */}
      {showAddDocumentOverlay && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Add New Document
              </h3>
              <button
                onClick={handleCloseAddDocumentOverlay}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <CloseIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <div className="p-6">
              <div className="mb-4">
                <label htmlFor="documentName" className="block text-sm font-medium text-gray-700 mb-2">
                  Document Name
                </label>
                <input
                  type="text"
                  id="documentName"
                  value={newDocumentName}
                  onChange={(e) => setNewDocumentName(e.target.value)}
                  placeholder="Enter document name (e.g., Passport, Birth Certificate)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleAddDocumentSubmit();
                    }
                  }}
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-end space-x-3">
                <button
                  onClick={handleCloseAddDocumentOverlay}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddDocumentSubmit}
                  className="px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-md hover:bg-teal-700 transition-colors"
                >
                  Add Document
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Announcement Overlay */}
      {showAnnouncementOverlay && selectedStudentForAnnouncement && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Send Mail to {userData.name}
              </h3>
              <button
                onClick={handleCloseAnnouncementOverlay}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <CloseIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <div className="p-6 overflow-auto max-h-[calc(90vh-120px)]">
              <div className="mb-4">
                <label htmlFor="announcementEmail" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="announcementEmail"
                  value={announcementEmail|| ''}
                  onChange={(e) => setAnnouncementEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="Enter email address"
                />
              </div>

              <div className="mb-6">
                <label htmlFor="announcementRemark" className="block text-sm font-medium text-gray-700 mb-2">
                  Announcement Message
                </label>
                <textarea
                  id="announcementRemark"
                  value={announcementRemark}
                  onChange={(e) => setAnnouncementRemark(e.target.value)}
                  rows={12}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                  placeholder="Enter your announcement message"
                />
                <p className="text-xs text-gray-500 mt-1">
                  The message above is a template. You can modify it as needed.
                </p>
              </div>

              {/* Buttons */}
              <div className="flex justify-end space-x-3">
                <button
                  onClick={handleCloseAnnouncementOverlay}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendAnnouncement}
                  className="px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-md hover:bg-teal-700 transition-colors"
                >
                  Send Announcement
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DocumentLayout>
    );
};




export const getServerSideProps: GetServerSideProps = async (context) => {
  const id = context.params?.id as string; // explicitly cast to string

  console.log("Fetching data for:", id);

  return {
    props: { id }, // passed to the component as props
  };
};

export default DocumentPage;
